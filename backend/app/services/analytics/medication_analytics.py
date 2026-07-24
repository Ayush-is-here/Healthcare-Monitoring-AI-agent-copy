from uuid import UUID
from sqlalchemy.orm import Session

from app.schemas.analytics.dashboard_analytics import MedicationAnalytics
from app.repositories.medication_repository import MedicationRepository
from app.repositories.medication_reminder_repository import MedicationReminderRepository


class MedicationAnalyticsService:

    @staticmethod
    def get_summary(
        db: Session,
        patient_profile_id: UUID
    ) -> MedicationAnalytics:


        active_medications = MedicationRepository.count_active_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile_id
        )

        reminders_today = MedicationReminderRepository.count_due_today(
            db=db,
            patient_profile_id=patient_profile_id
        )

        return MedicationAnalytics(
            active_medications=active_medications,
            reminders_today=reminders_today,
        )