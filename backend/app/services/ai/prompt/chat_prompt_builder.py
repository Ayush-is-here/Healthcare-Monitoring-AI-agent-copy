from app.schemas.ai.health_context import HealthContext
from app.services.ai.prompt.prompt_builder import PromptBuilder


class ChatPromptBuilder:

    @staticmethod
    def build_context_block(health_context: HealthContext) -> str:

        sections: list[str] = [
            "# PATIENT HEALTH CONTEXT",
            PromptBuilder.build_patient_section(health_context.patient),
            PromptBuilder.build_metrics_section(health_context.latest_metrics),
            PromptBuilder.build_medication_section(health_context.medications),
            PromptBuilder.build_appointment_section(health_context.appointments),
        ]

        return "\n\n".join(sections)