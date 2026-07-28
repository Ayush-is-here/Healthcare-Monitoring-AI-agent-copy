from app.schemas.ai.patient_context import PatientContext
from app.schemas.ai.latest_metric_context import LatestMetricContext
from app.schemas.ai.medication_context import MedicationContext
from app.schemas.ai.appointment_context import AppointmentContext
from app.schemas.rule_engine.rule_result import RuleResult
from app.schemas.ai.health_context import HealthContext


class PromptBuilder:

    @staticmethod
    def _format_optional(
        value: object,
        unit: str = ""
    ) -> str:

        if value is None:
            return "Not Available"

        return f"{value} {unit}".strip()


    @staticmethod
    def build_patient_section(
        patient_context: PatientContext
    ) -> str:

        patient_section: list[str] = [
            "## PATIENT PROFILE",
            f"- **Age:** {PromptBuilder._format_optional(patient_context.age)}",
            f"- **Gender:** {PromptBuilder._format_optional(patient_context.gender)}",
            f"- **Blood Group:** {PromptBuilder._format_optional(patient_context.blood_group)}",
            f"- **Height:** {PromptBuilder._format_optional(patient_context.height_cm,unit="cm")}",
            f"- **Weight:** {PromptBuilder._format_optional(patient_context.weight_kg,unit="kg")}",
            f"- **Smoking Status:** {PromptBuilder._format_optional(patient_context.smoking_status)}",
            f"- **Drinking Status:** {PromptBuilder._format_optional(patient_context.drinking_status)}"
        ]


        patient_section.append("### ALLERGIES")

        if patient_context.allergies:
            for allergy in patient_context.allergies:
                patient_section.append(f"- {allergy}")
        else:
            patient_section.append("Not Available")

        patient_section.append("")


        patient_section.append("### CHRONIC CONDITIONS")

        if patient_context.chronic_conditions:
            for condition in patient_context.chronic_conditions:
                patient_section.append(f"- {condition}")
        else:
            patient_section.append("Not Available")

        return "\n".join(patient_section)


    @staticmethod
    def build_metrics_section(
        latest_metric_context: list[LatestMetricContext]
    ) -> str:

        latest_metric_section: list[str] = [
            "## LATEST HEALTH METRICS"
        ]


        if latest_metric_context:
            for metric in latest_metric_context:
                latest_metric_section.append(f"- {metric.metric_type}: {metric.value} {metric.unit}")
                latest_metric_section.append(f"  Recorded At: {metric.recorded_at.strftime("%d %b %Y, %H:%M UTC")}")

            return "\n".join(latest_metric_section)

        latest_metric_section.append("Not Available")

        return "\n".join(latest_metric_section)


    @staticmethod
    def build_medication_section(
        medications: list[MedicationContext]
    ) -> str:


        medication_section: list[str] = [
            "## ACTIVE MEDICATIONS"
        ]

        if medications:
            for medication in medications:
                medication_section.append(f"- {medication.medicine_name}")
                medication_section.append(f"  Dosage: {medication.dosage} {medication.dosage_unit}")
                medication_section.append(f"  Frequency: {medication.frequency}")
                medication_section.append(f"  Start Date: {medication.start_date}")
                medication_section.append(f"  End Date: {PromptBuilder._format_optional(medication.end_date)}")
                medication_section.append(f"  Instructions: {PromptBuilder._format_optional(medication.instructions)}")
                medication_section.append("")

            return "\n".join(medication_section)

        medication_section.append(f"Not Available")

        return "\n".join(medication_section)


    @staticmethod
    def build_appointment_section(
        appointment_context: list[AppointmentContext]
        ) -> str:

        appointment_section: list[str] = [
            "## UPCOMING APPOINTMENTS"
        ]

        if appointment_context:
            for appointment in appointment_context:
                appointment_section.append(f"- Doctor: {appointment.doctor_name}")
                appointment_section.append(f"  Scheduled: {appointment.appointment_date} {appointment.appointment_time}")
                appointment_section.append(f"  Purpose: {appointment.purpose}")
                appointment_section.append(f"  Location: {PromptBuilder._format_optional(appointment.location)}")
                appointment_section.append(f"  Notes: {PromptBuilder._format_optional(appointment.notes)}")
                appointment_section.append(f"  Status: {appointment.status}")
                appointment_section.append("")

            return "\n".join(appointment_section)

        appointment_section.append("Not Available")

        return "\n".join(appointment_section)

    @staticmethod
    def build_triggered_rules_section(
        triggered_rules: list[RuleResult]
    ) -> str:

        triggered_rules_section: list[str] = [
            "## TRIGGERED HEALTH RULES"
        ]

        if triggered_rules:
            for triggered_rule in triggered_rules:
                triggered_rules_section.append(f"- {triggered_rule.rule_name}")
                triggered_rules_section.append(f"  Reason: {triggered_rule.reason}")
                triggered_rules_section.append("")

            return "\n".join(triggered_rules_section)

        triggered_rules_section.append("No urgent health rules triggered.")

        return "\n".join(triggered_rules_section)


    @staticmethod
    def build_prompt(
        health_context: HealthContext,
        triggered_rules: list[RuleResult]
    ) -> str:

        patient_prompt = PromptBuilder.build_patient_section(health_context.patient)
        metric_prompt = PromptBuilder.build_metrics_section(health_context.latest_metrics)
        medication_prompt = PromptBuilder.build_medication_section(health_context.medications)
        appointment_prompt = PromptBuilder.build_appointment_section(health_context.appointments)
        triggered_rules_prompt = PromptBuilder.build_triggered_rules_section(triggered_rules)

        prompt: list[str] = [
            patient_prompt,
            metric_prompt,
            medication_prompt,
            appointment_prompt,
            triggered_rules_prompt
        ]

        prompt.append("# TASK")
        prompt.append("Analyze the patient information provided above.")
        prompt.append("Identify significant health findings and potential health risks.")
        prompt.append("Generate practical lifestyle recommendations based only on the available information.")
        prompt.append("Return ONLY the required JSON object that follows the specified response schema.")

        return "\n".join(prompt)