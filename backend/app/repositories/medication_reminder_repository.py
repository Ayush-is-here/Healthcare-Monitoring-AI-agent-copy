from sqlalchemy.orm import Session
from datetime import time, date
from sqlalchemy import select, func
from app.models.medication_reminder import MedicationReminder
from app.dto.notification.medication_reminder_notification import MedicationReminderNotificationDTO
from app.models.user import User
from app.models.medication import Medication
from app.models.patient_profile import PatientProfile
from app.schemas.medication_reminder import MedicationReminderCreate, MedicationReminderUpdate
from uuid import UUID


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

    @staticmethod
    def count_due_today(
        db: Session,
        patient_profile_id: UUID
    ) -> int:

        return db.scalar(
        select(func.count())
        .select_from(MedicationReminder)
        .join(
            Medication,
            Medication.id == MedicationReminder.medication_id
        )
        .where(
            Medication.patient_profile_id == patient_profile_id,
            MedicationReminder.is_active == True
        )
    ) or 0



    

    @staticmethod
    def create(
        db: Session,
        medication_reminder_data: MedicationReminderCreate
    ) -> MedicationReminder:

        medication_reminder = MedicationReminder(
            **medication_reminder_data.model_dump()
        )

        db.add(medication_reminder)
        db.commit()
        db.refresh(medication_reminder)

        return medication_reminder

    @staticmethod
    def list_by_medication_id(
        db: Session,
        medication_id: UUID
    ) -> list[MedicationReminder]:

        return db.scalars(
            select(MedicationReminder).where(MedicationReminder.medication_id == medication_id).
            order_by(MedicationReminder.created_at.desc())
        ).all()

    @staticmethod
    def get_by_id(
        db:Session,
        medication_reminder_id: UUID
    ) -> MedicationReminder | None :

        return db.scalars(
            select(MedicationReminder).where(MedicationReminder.id == medication_reminder_id)
        ).one_or_none()


    @staticmethod
    def update(
        db: Session,
        medication_reminder: MedicationReminder,
        medication_reminder_data: MedicationReminderUpdate
    ) -> MedicationReminder:

        update_data = medication_reminder_data.model_dump(exclude_unset=True)
        

        for key, value in update_data.items():
            setattr(medication_reminder, key, value)

        db.commit()
        db.refresh(medication_reminder)

        return medication_reminder

    @staticmethod
    def delete(
        db: Session,
        medication_reminder: MedicationReminder
    ) -> None:
        db.delete(medication_reminder)
        db.commit()