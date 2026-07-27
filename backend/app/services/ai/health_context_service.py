from sqlalchemy.orm import Session
from uuid import UUID
from app.services.ai.context_builder.health_context_builder import HealthContextBuilder
from app.schemas.ai.health_context import HealthContext
from app.repositories.profile_repository import ProfileRepository
from app.repositories.medication_repository import MedicationRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.health_metric_repository import HealthMetricRepository



class HealthContextService:

    @staticmethod
    def build(
        db: Session,
        patient_profile_id: UUID
    ) -> HealthContext:

        patient_profile = ProfileRepository.get_by_id(
            db=db,
            patient_profile_id=patient_profile_id
        )

        medications = MedicationRepository.list_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile_id
        )

        appointments = AppointmentRepository.list_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile_id
        )

        metrics = HealthMetricRepository.list_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile_id
        )

        return HealthContextBuilder.build(
            patient_profile=patient_profile,
            medications=medications,
            appointments=appointments,
            metrics=metrics
        )