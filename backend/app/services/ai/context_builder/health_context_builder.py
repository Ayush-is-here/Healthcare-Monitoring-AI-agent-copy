from app.models.patient_profile import PatientProfile
from app.schemas.ai.health_context import HealthContext
from app.services.ai.context_builder.patient_context_builder import PatientContextBuilder
from app.models.medication import Medication
from app.models.appointment import Appointment
from app.models.health_metric import HealthMetric

from app.services.ai.context_builder.medication_context_builder import MedicationContextBuilder
from app.services.ai.context_builder.appointment_context_builder import AppointmentContextBuilder
from app.services.ai.context_builder.metric_context_builder import MetricContextBuilder

from datetime import datetime, UTC


class HealthContextBuilder:
    @staticmethod
    def build(
        patient_profile: PatientProfile,
        medications: list[Medication],
        appointments: list[Appointment],
        metrics: list[HealthMetric]
    ) -> HealthContext:

        patient_context = PatientContextBuilder.build(
            patient_profile=patient_profile
        )

        medication_context = [
            MedicationContextBuilder.build(med)
            for med in medications
        ]

        appointment_context = [
            AppointmentContextBuilder.build(appointment)
            for appointment in appointments
        ]

        metric_context = [
            MetricContextBuilder.build(metric)
            for metric in metrics
        ]

        return HealthContext(
            patient=patient_context,
            latest_metrics=metric_context,
            medications=medication_context,
            appointments=appointment_context,
            generated_at=datetime.now(UTC)
        )