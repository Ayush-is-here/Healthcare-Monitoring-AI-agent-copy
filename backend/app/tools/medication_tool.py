from uuid import UUID

import httpx
from app.tools.base_tool import BaseTool
from app.dto.agent.tool_payload.medication.medication_snapshot import MedicationSnapshot, MedicationNormalizationStatus
from app.schemas.ai.medication_context import MedicationContext
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.agents.state import HealthInsightState
from app.dto.agent.tool_payload.tool_result import ToolResult
from app.dto.agent.tool_payload.medication.medication_payload import MedicationPayload
from app.tools.enum import ToolType
from app.models.enum import DosageUnit, MedicationFrequency
from app.schemas.ai.health_context import HealthContext
from app.schemas.ai.patient_context import PatientContext


class MedicationTool(BaseTool):

    def __init__(
            self,
            ai_adapter: BaseAIAdapter
    ):
        self.ai_adapter = ai_adapter
        



# ================================================================

    def _find_rxcui(
        self,
        name: str
        ) -> str | None:

        url = "https://rxnav.nlm.nih.gov/REST/rxcui.json"

        try:
            response = httpx.get(
                url,
                params={
                    "name": name,
                    "search": 2
                },
                timeout=10.0
            )

            response.raise_for_status()

            data = response.json()

            rxnorm_ids = (
                data.get("idGroup", {}).get("rxnormId", [])
            )

            if not rxnorm_ids:
                return None

            return str(rxnorm_ids[0])

        except httpx.HTTPError as e:
            raise RuntimeError(
                f"RxNorm excat lookup failed for '{name}': {e}"
            ) from e

        except (ValueError, TypeError) as e:
            raise RuntimeError(
                f"Invalid RxNorm response for '{name}': {e}"
            )

# ====================================================================================

    def _approximate_rxcui(
        self,
        name: str
        ) -> str | None:
        
        url = "https://rxnav.nlm.nih.gov/REST/approximateTerm.json"

        try:
            response = httpx.get(
                url,
                params={
                    "term":name,
                    "maxEntries": 1
                },
                timeout=10.0
            )

            response.raise_for_status()

            data = response.json()

            candidates = (
                data.get("approximateGroup", {}).get("candidate", [])
            )

            if not candidates:
                return None

            rxcui = candidates[0].get("rxcui")

            if rxcui is None:
                return None

            return str(rxcui)

        except httpx.HTTPError as e:
            raise RuntimeError(
                f"RxNorm approximate lookup failed for '{name}': {e}"
            ) from e

        except (ValueError, TypeError) as e:
            raise RuntimeError(
                f"Invalid RxNorm approximate response for '{name}': {e}"
            ) from e

# ====================================================================================

    def _get_rxnorm_name(
        self,
        rxcui: str
    ) -> str | None:

        url = f"https://rxnav.nlm.nih.gov/REST/rxcui/{rxcui}/property.json"

        try:
            response = httpx.get(
                url,
                params={
                    "propName": "RxNorm Name"
                },
                timeout=10.0
            )

            response.raise_for_status()

            data = response.json()

            properties = (
                data
                .get("propConceptGroup", {})
                .get("propConcept", [])
            )

            if not properties:
                return None

            return properties[0].get("propValue")

        except httpx.HTTPError as e:
            raise RuntimeError(
                f"RxNorm name lookup failed for RxCUI '{rxcui}': {e}"
            ) from e

        except (ValueError, TypeError) as e:
            raise RuntimeError(
                f"Invalid RxNorm name response for RxCUI '{rxcui}': {e}"
            ) from e
        
# ======================================================================

    def _normalize_medication(
            self,
            medication: MedicationContext
            ) -> tuple[MedicationSnapshot, str | None]:

        try:
            rxcui = self._find_rxcui(
                name=medication.medicine_name
            )

            if rxcui is None:
                rxcui = self._approximate_rxcui(
                    name=medication.medicine_name
                )

            if rxcui is None:
                snapshot = MedicationSnapshot(
                    medicine_name=medication.medicine_name,
                    rxnorm_name=None,
                    rxcui=None,
                    dosage=medication.dosage,
                    dosage_unit=medication.dosage_unit,
                    frequency=medication.frequency,
                    is_active=medication.is_active,
                    normalization_status=(
                        MedicationNormalizationStatus.NOT_FOUND
                    )
                    )

                return (
                    snapshot,
                    f"Medication '{medication.medicine_name}' "
                    "could not be found in the RxNorm."
                )

            rxnorm_name = self._get_rxnorm_name(
                rxcui=rxcui
            )

            if rxnorm_name is None:
                snapshot = MedicationSnapshot(
                    medicine_name=medication.medicine_name,
                    rxnorm_name=None,
                    rxcui=rxcui,
                    dosage=medication.dosage,
                    dosage_unit=medication.dosage_unit,
                    frequency=medication.frequency,
                    is_active=medication.is_active,
                    normalization_status=(
                        MedicationNormalizationStatus.LOOKUP_FAILED
                        )
                        )

                return (
                    snapshot,
                    f"RxNorm name could not be resolved for "
                    f"'{medication.medicine_name}'."
                )

            snapshot = MedicationSnapshot(
                medicine_name=medication.medicine_name,
                rxnorm_name=rxnorm_name,
                rxcui=rxcui,
                dosage=medication.dosage,
                dosage_unit=medication.dosage_unit,
                frequency=medication.frequency,
                is_active=medication.is_active,
                normalization_status=(
                    MedicationNormalizationStatus.MATCHED
                )
                )

            return snapshot, None


        except RuntimeError as e:

            snapshot = MedicationSnapshot(
                medicine_name=medication.medicine_name,
                rxnorm_name=None,
                rxcui=None,
                dosage=medication.dosage,
                dosage_unit=medication.dosage_unit,
                frequency=medication.frequency,
                is_active=medication.is_active,
                normalization_status=(
                    MedicationNormalizationStatus.LOOKUP_FAILED
                )
            )

            return (
                snapshot,
                f"Failed to normalize medication "
                f"'{medication.medicine_name}': {e}"
            )

# ==================================================================================

    def _fetch_label_interactions(
        self,
        rxcui: str,
        medication_name: str
        ) -> tuple[list[str], list[str]]:

        url = "https://api.fda.gov/drug/label.json"

        try:
        # ---------------------------------------------------------
        # 1. Try exact OpenFDA RxCUI lookup
        # ---------------------------------------------------------
            response = httpx.get(
                url,
                params={
                    "search": f'openfda.rxcui:"{rxcui}"',
                    "limit": 1
                },
                timeout=10.0
            )

        # ---------------------------------------------------------
        # 2. If no label exists for this RxCUI, fall back to
        #    normalized medication name.
        # ---------------------------------------------------------
            if response.status_code == 404:

                response = httpx.get(
                    url,
                    params={
                        "search": (
                            f'openfda.generic_name:"'
                            f'{medication_name.upper()}"'
                        ),
                        "limit": 1
                    },
                    timeout=10.0
                )


        # No FDA label found through either lookup.
            if response.status_code == 404:
                return [], []

            response.raise_for_status()

            data = response.json()

            results = data.get("results", [])


            if not results:
                return [], []

            drug_label_data = results[0]

        # ---------------------------------------------------------
        # 3. Primary interaction section
        # ---------------------------------------------------------
            interactions = drug_label_data.get(
                "drug_interactions",
                []
            )

        # ---------------------------------------------------------
        # 4. General warnings section
        # ---------------------------------------------------------
            warnings = drug_label_data.get(
                "warnings",
                []
            )


        # ---------------------------------------------------------
        # 5. If the label has no explicit interaction section,
        #    use warnings as the defensive fallback.
        # ---------------------------------------------------------
            if not interactions:

                if warnings:
                    interactions = [
                       f"General Label Warnings: {warnings[0]}"
                   ]

                else:
                    interactions = [
                    "No specific drug interaction warnings or "
                    "structural safety flags were found in the "
                    "available FDA label sections."
                ]

            return interactions, warnings

        except httpx.HTTPError as e:
            raise RuntimeError(
            f"FDA label lookup failed for medication "
            f"'{medication_name}' with RxCUI '{rxcui}': {e}"
        ) from e

        except (ValueError, TypeError) as e:
            raise RuntimeError(
            f"Invalid FDA label response for medication "
            f"'{medication_name}' with RxCUI '{rxcui}': {e}"
        ) from e
            
# =====================================================

    def _synthesize_interactions(
            self,
            medication_interactions: dict[str, list[str]]
            ) -> str | None:

        if not medication_interactions:
            return None

        interaction_text = "\n\n".join(
            [
                (
                    f"Medication: {medicine_name}\n"
                    f"FDA label interaction text:\n"
                    f"{chr(10).join(interactions)}"
            )
                for medicine_name, interactions
                in medication_interactions.items()
            ]
        )

        system_instruction = """
You are a clinical information summarization assistant.

Use ONLY the FDA label text provided in the user prompt.
Do not use outside medical knowledge.

Your task is to identify potentially relevant medication-to-medication
interactions explicitly supported by the provided FDA label text.

Rules:

- Compare the medications listed in the prompt against the FDA label
  text provided for those medications.
- Only report relationships explicitly stated in the provided text.
- Do not infer, assume, or invent an interaction.
- If a label explicitly mentions another medication in the list,
  name both medications and describe the relationship stated by
  the label.
- If a label mentions a medication class, and another medication
  in the list belongs to that explicitly referenced class according
  to the provided label text, report that relationship only when
  the connection is explicit in the provided text.
- Pay particular attention to phrases such as:
  "taking X",
  "with X",
  "other drugs containing X",
  "may decrease the benefit of X",
  "may increase the risk with X",
  and similar explicit medication references.
- Do not treat general warnings as confirmed patient-specific
  interactions.
- Distinguish between:
  1. an explicit medication interaction/reference in the label, and
  2. a general safety warning that does not identify another
     medication in the current list.
- If an explicit relevant relationship is found, state it clearly.
- If no explicit relevant relationship is found, say so plainly.
- Keep the response to 3-5 sentences.
- Do not provide medical advice.
- Do not diagnose the patient.
- Recommend discussing medication interactions with a pharmacist
  or doctor for patient-specific assessment.
"""

        user_prompt = f"""
Review these FDA medication label excerpts:

{interaction_text}
""".strip()

        try:
            return self.ai_adapter.generate(
                system_instruction=system_instruction,
                user_prompt=user_prompt
            ).strip()

        except Exception as e:
            raise RuntimeError(
                f"Failed to synthesize medication interactions: {e}"
            ) from e

# ==========================================================



    def execute(
            self,
            state: HealthInsightState
            ) -> ToolResult:
        medication_snapshots: list[MedicationSnapshot] = []
        lookup_issues: list[str] = []

        # FDA label interaction text collected by medication name
        medication_interactions: dict[str, list[str]] = {}
        medication_warnings: dict[str, list[str]] = {}

        active_medication_count = 0

        for medication in state.health_context.medications:

            # ---------------------------------------------------------
            # 1. Normalize medication through RxNorm
            # ---------------------------------------------------------
            snapshot, issue = self._normalize_medication(
                medication=medication
            )

            medication_snapshots.append(snapshot)

            if issue is not None:
                lookup_issues.append(issue)

        # ---------------------------------------------------------
            # 2. Only active + successfully normalized medications
            #    should be checked against FDA labels
            # ---------------------------------------------------------
            if (
                medication.is_active
                and snapshot.rxcui is not None
                and snapshot.normalization_status
                == MedicationNormalizationStatus.MATCHED
            ):
                active_medication_count += 1

                try:
                    interactions, warnings = self._fetch_label_interactions(
                        rxcui=snapshot.rxcui,
                        medication_name=snapshot.medicine_name
                    )

                    # Defensive handling
                    if isinstance(interactions, str):
                        interactions = [interactions]

                    if interactions:
                        medication_interactions[
                            medication.medicine_name
                        ] = interactions

                    if isinstance(warnings, str):
                        warnings = [warnings]

                    if warnings:
                        medication_warnings[
                            medication.medicine_name
                        ] = warnings

                    

                except RuntimeError as e:

                    lookup_issues.append(
                        f"Failed to fetch FDA label interactions "
                        f"for '{medication.medicine_name}': {e}"
                    )

        # ---------------------------------------------------------
        # 3. Generate interaction summary only when it makes sense
        # ---------------------------------------------------------
        interaction_summary: str | None = None
        interaction_disclaimer: str | None = None

        if (
            active_medication_count >= 2
            and medication_interactions
        ):
            
            try:

                interaction_summary = (
                    self._synthesize_interactions(
                        medication_interactions=medication_interactions
                    )
                )

                if interaction_summary is not None:
                    interaction_disclaimer = (
                        "This summary is generated from FDA medication "
                        "label information and is not a certified drug-"
                        "drug interaction database. Consult a pharmacist "
                        "or doctor for clinical medication interaction "
                        "assessment."
                    )

            except RuntimeError as e:

                lookup_issues.append(
                    f"Failed to generate medication interaction "
                   f"summary: {e}"
                )

        # ---------------------------------------------------------
        # 4. Build the medication payload
        # ---------------------------------------------------------
        payload = MedicationPayload(
            medications=medication_snapshots,
            lookup_issues=lookup_issues,
            interaction_summary=interaction_summary,
            warnings=medication_warnings,
            interaction_disclaimer=interaction_disclaimer
        )

        print("Medication tool used.")

        # ---------------------------------------------------------
        # 5. Return standard ToolResult
        # ---------------------------------------------------------
        return ToolResult(
            tool_type=ToolType.MEDICATION,
            payload=payload
        )



# TESTS=================================================================



# if __name__ == "__main__":
#     tool = MedicationTool.__new__(MedicationTool)

#     rxcui = tool._find_rxcui(
#         name="aspirin"
#     )

#     print("RxCUI:")
#     print(rxcui)



# if __name__ == "__main__":
#     tool = MedicationTool.__new__(MedicationTool)

#     rxcui = tool._approximate_rxcui(
#         name="asprin"
#     )

#     print("Approximate RxCUI:")
#     print(rxcui)





# if __name__ == "__main__":
#     tool = MedicationTool.__new__(MedicationTool)

#     rxnorm_name = tool._get_rxnorm_name(
#         rxcui="1191"
#     )

#     print("RxNorm Name:")
#     print(rxnorm_name)




# if __name__ == "__main__":
#     from datetime import date

#     medication = MedicationContext(
#         medicine_name="aspirin",
#         dosage=100.0,
#         dosage_unit=DosageUnit.MG,
#         frequency=MedicationFrequency.ONCE_DAILY,
#         is_active=True,
#         start_date=date.today(),
#         end_date=None,
#         instructions="Take after food."
#     )

#     tool = MedicationTool.__new__(MedicationTool)

#     snapshot, issue = tool._normalize_medication(
#         medication=medication
#     )

#     print("SNAPSHOT:")
#     print(snapshot)

#     print("\nISSUE:")
#     print(issue)




# if __name__ == "__main__":
#     from datetime import date

#     medication = MedicationContext(
#         medicine_name="definitely_not_a_real_medication_xyz",
#         dosage=100.0,
#         dosage_unit=DosageUnit.MG,
#         frequency=MedicationFrequency.ONCE_DAILY,
#         is_active=True,
#         start_date=date.today(),
#         end_date=None,
#         instructions=None
#     )

#     tool = MedicationTool.__new__(MedicationTool)

#     snapshot, issue = tool._normalize_medication(
#         medication=medication
#     )

#     print("SNAPSHOT:")
#     print(snapshot)

#     print("\nISSUE:")
#     print(issue)




# if __name__ == "__main__":
    # from datetime import date, datetime

    # class FakeAIAdapter(BaseAIAdapter):

    #     def generate(
    #         self,
    #         system_instruction: str,
    #         user_prompt: str,
    #         response_schema=None
    #     ) -> str:
    #         return (
    #             "No relevant medication interaction found "
    #             "in the provided FDA label text."
    #         )

    # medication = MedicationContext(
    #     medicine_name="aspirin",
    #     dosage=100.0,
    #     dosage_unit=DosageUnit.MG,
    #     frequency=MedicationFrequency.ONCE_DAILY,
    #     is_active=True,
    #     start_date=date.today(),
    #     end_date=None,
    #     instructions="Take after food."
    # )

    # patient = PatientContext(
    #     age=50,
    #     gender=None,
    #     blood_group=None,
    #     height_cm=None,
    #     weight_kg=None,
    #     smoking_status=None,
    #     drinking_status=None,
    #     allergies=[],
    #     chronic_conditions=[]
    # )

    # health_context = HealthContext(
    #     patient=patient,
    #     latest_metrics=[],
    #     medications=[medication],
    #     appointments=[],
    #     generated_at=datetime.now(),
    #     context_version="1.0"
    # )

    # state = HealthInsightState(
    #     health_context=health_context,
    #     triggered_rules=[],
    #     user_id=UUID("00000000-0000-0000-0000-000000000001")
    # )

    # tool = MedicationTool(
    #     ai_adapter=FakeAIAdapter()
    # )

    # result = tool.execute(
    #     state=state
    # )

    # print("TOOL TYPE:")
    # print(result.tool_type)

    # print("\nPAYLOAD:")
    # print(result.payload)

    # print("\nMEDICATIONS:")
    # print(result.payload.medications)

    # print("\nLOOKUP ISSUES:")
    # print(result.payload.lookup_issues)

    # print("\nINTERACTION SUMMARY:")
    # print(result.payload.interaction_summary)

    # print("\nWARNING:")
    # print(result.payload.warnings)

    # print("\nINTERACTION DISCLAIMER:")
    # print(result.payload.interaction_disclaimer)



if __name__ == "__main__":
    from datetime import date, datetime

    class FakeAIAdapter(BaseAIAdapter):

        def generate(
            self,
            system_instruction: str,
            user_prompt: str,
            response_schema=None
        ) -> str:

            print("\n===== AI SYSTEM INSTRUCTION =====")
            print(system_instruction)

            print("\n===== AI USER PROMPT =====")
            print(user_prompt)

            return (
                "The provided FDA label text contains potentially "
                "relevant interaction information between the "
                "listed medications. The labels should be reviewed "
                "by a pharmacist or doctor for patient-specific "
                "assessment."
            )

    # ---------------------------------------------------------
    # 1. Medication 1
    # ---------------------------------------------------------

    medication_1 = MedicationContext(
        medicine_name="aspirin",
        dosage=100.0,
        dosage_unit=DosageUnit.MG,
        frequency=MedicationFrequency.ONCE_DAILY,
        is_active=True,
        start_date=date.today(),
        end_date=None,
        instructions="Take after food."
    )

    # ---------------------------------------------------------
    # 2. Medication 2
    # ---------------------------------------------------------

    medication_2 = MedicationContext(
        medicine_name="ibuprofen",
        dosage=200.0,
        dosage_unit=DosageUnit.MG,
        frequency=MedicationFrequency.ONCE_DAILY,
        is_active=True,
        start_date=date.today(),
        end_date=None,
        instructions=None
    )

    # ---------------------------------------------------------
    # 3. Patient
    # ---------------------------------------------------------

    patient = PatientContext(
        age=50,
        gender=None,
        blood_group=None,
        height_cm=None,
        weight_kg=None,
        smoking_status=None,
        drinking_status=None,
        allergies=[],
        chronic_conditions=[]
    )

    # ---------------------------------------------------------
    # 4. Health context
    # ---------------------------------------------------------

    health_context = HealthContext(
        patient=patient,
        latest_metrics=[],
        medications=[
            medication_1,
            medication_2
        ],
        appointments=[],
        generated_at=datetime.now(),
        context_version="1.0"
    )

    # ---------------------------------------------------------
    # 5. State
    # ---------------------------------------------------------

    state = HealthInsightState(
        health_context=health_context,
        triggered_rules=[],
        user_id=UUID(
            "00000000-0000-0000-0000-000000000001"
        )
    )

    # ---------------------------------------------------------
    # 6. Tool
    # ---------------------------------------------------------

    tool = MedicationTool(
        ai_adapter=FakeAIAdapter()
    )

    # ---------------------------------------------------------
    # 7. Execute
    # ---------------------------------------------------------

    result = tool.execute(
        state=state
    )

    # ---------------------------------------------------------
    # 8. Inspect result
    # ---------------------------------------------------------

    print("\n===== TOOL TYPE =====")
    print(result.tool_type)

    print("\n===== PAYLOAD =====")
    print(result.payload)

    print("\n===== MEDICATIONS =====")
    print(result.payload.medications)

    print("\n===== LOOKUP ISSUES =====")
    print(result.payload.lookup_issues)

    print("\n===== INTERACTION SUMMARY =====")
    print(result.payload.interaction_summary)

    print("\n===== WARNINGS =====")
    print(result.payload.warnings)

    print("\n===== INTERACTION DISCLAIMER =====")
    print(result.payload.interaction_disclaimer)





# if __name__ == "__main__":
#     tool = MedicationTool.__new__(MedicationTool)

#     interactions, warnings = tool._fetch_label_interactions(
#         rxcui="1191"
#     )

#     print("INTERACTIONS:")
#     print(interactions)

#     print("\nWARNINGS:")
#     print(warnings)