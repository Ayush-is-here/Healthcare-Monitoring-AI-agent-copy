from sqlalchemy.orm import Session
from datetime import time
from sqlalchemy import select
from app.models.medication_reminder import MedicationReminder
from app.dto.notification_dto import MedicationReminderNotificationDTO
from app.models.user import User
from app.models.medication import Medication
from app.models.patient_profile import PatientProfile


class MedicationReminderRepository:
    @staticmethod
    def get_due_medication_notifications(
        db: Session,
        current_time: time
    ) -> list[MedicationReminderNotificationDTO]:
        
        rows = db.execute(
            select(
                User.name,
                User.email,
                Medication.medicine_name,
                Medication.dosage,
                Medication.dosage_unit,
                Medication.instructions,
                MedicationReminder.reminder_time
            ).select_from(MedicationReminder).join(
                Medication,
                MedicationReminder.medication_id == Medication.id
            ).join(
                PatientProfile,
                PatientProfile.id == Medication.patient_profile_id
            ).join(
                User,
                User.id == PatientProfile.user_id
            ).where(
                MedicationReminder.is_active.is_(True),
                MedicationReminder.reminder_time == current_time
            )
                  ).all()
        
        return [
            MedicationReminderNotificationDTO(
                name=row.name,
                email=row.email,
                medicine_name=row.medicine_name,
                dosage=row.dosage,
                dosage_unit=row.dosage_unit,
                reminder_time=row.reminder_time,
                instructions=row.instructions
            )
            for row in rows
        ]