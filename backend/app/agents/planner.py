from app.agents.state import HealthInsightState
from app.dto.agent.execution_plan import ExecutionPlan
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter


class Planner:

    def __init__(
        self,
        ai_adapter: BaseAIAdapter
    ):
        self.ai_adapter = ai_adapter

    def plan(
        self,
        state: HealthInsightState
    ) -> ExecutionPlan:

        prompt = self._build_prompt(state)

        raw_response = self.ai_adapter.generate(
            system_instruction=self._system_instruction(),
            user_prompt=prompt,
            response_schema=ExecutionPlan
        )

        print(raw_response)

        return ExecutionPlan.model_validate_json(raw_response)

    @staticmethod
    def _system_instruction() -> str:
        return """
You are the planning component of a healthcare monitoring AI agent.

Determine which available tools are genuinely necessary for the
patient's current situation.

Available tools:
- CLINICAL_RESEARCH:
  Retrieves relevant medical literature from PubMed when
  external clinical evidence would improve the analysis.

- MEDICATION:
  Normalizes the patient's current medications against RxNorm and
  retrieves FDA label information, including drug interaction and
  warning sections. Useful when the patient has active medications
  whose safety, interactions, or warnings are relevant.

Select only the tools that are genuinely useful.

After selecting the tools, provide a brief decision summary
explaining the key patient findings that made those tools useful.

Do NOT provide chain-of-thought or detailed internal reasoning.
Return only the requested ExecutionPlan structure.
""".strip()

    @staticmethod
    def _build_prompt(
        state: HealthInsightState
    ) -> str:

        context = state.health_context

        metrics = "\n".join(
            f"- {metric.metric_type}: "
            f"{metric.value} {metric.unit or ''}"
            for metric in context.latest_metrics
        )

        rules = "\n".join(
            f"- {rule.rule_name}: {rule.reason}"
            for rule in state.triggered_rules
        )

        medications = "\n".join(
            f"- {medication.medicine_name}"
            for medication in context.medications
        )

        appointments = "\n".join(
            f"- {appointment}"
            for appointment in context.appointments
        )


        return f"""
Patient:
- Age: {context.patient.age}
- Gender: {context.patient.gender}

Latest Health Metrics:
{metrics if metrics else "None"}

Triggered Clinical Rules:
{rules if rules else "None"}

Current Medications:
{medications if medications else "None"}

Appointments:
{appointments if appointments else "None"}
""".strip()