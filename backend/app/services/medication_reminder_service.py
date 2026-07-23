from sqlalchemy.orm import Session
from uuid import UUID
from app.models.patient_profile import PatientProfile
from app.repositories.profile_repository import ProfileRepository
from fastapi import HTTPException, status
from app.schemas.medication_reminder import MedicationReminderCreate, MedicationReminderUpdate
from app.models.medication_reminder import MedicationReminder
from app.repositories.medication_reminder_repository import MedicationReminderRepository
from app.repositories.medication_repository import MedicationRepository


class MedicationReminderService:

    @staticmethod
    def _get_patient_profile(
        db: Session,
        user_id: UUID
    ) -> PatientProfile:

        patient_profile = ProfileRepository.get_by_user_id(
            db=db,
            user_id=user_id
        )

        if patient_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient profile not found."
                )
                
        return patient_profile


    @staticmethod
    def create_medication_reminder(
        medication_reminder_data: MedicationReminderCreate,
        db: Session,
        user_id: UUID
        ) -> MedicationReminder:

        patient_profile = MedicationReminderService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        medication = MedicationRepository.get_by_id(
            db=db,
            medication_id=medication_reminder_data.medication_id
        )

        if medication is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medication not found"
            )

        if medication.patient_profile_id != patient_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to access this medication."
            )

        return MedicationReminderRepository.create(
            db=db,
            medication_reminder_data=medication_reminder_data,
        )


    @staticmethod
    def list_medication_reminders(
        db: Session,
        medication_id: UUID,
        user_id: UUID
    ) -> list[MedicationReminder]:

        patient_profile = MedicationReminderService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        medication = MedicationRepository.get_by_id(
            db=db,
            medication_id=medication_id
        )

        if medication is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medication_not_found"
            )

        if medication.patient_profile_id != patient_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to view this medication's reminders"
            )
        

        return MedicationReminderRepository.list_by_medication_id(
            db=db,
            medication_id=medication.id
        )

    @staticmethod
    def update_medication_reminder(
        db: Session,
        user_id: UUID,
        medication_reminder_id: UUID,
        medication_reminder_data: MedicationReminderUpdate
        ) -> MedicationReminder:

        patient_profile = MedicationReminderService._get_patient_profile(
            db=db,
            user_id=user_id
            )

        medication_reminder = MedicationReminderRepository.get_by_id(
            db=db,
            medication_reminder_id=medication_reminder_id
        )            

        if medication_reminder is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medication reminder not found."
                )

        medication = MedicationRepository.get_by_id(
            db=db,
            medication_id=medication_reminder.medication_id
            )

        if medication is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated medication record not found."
                )

        if medication.patient_profile_id != patient_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this medication reminder."
                )

        return MedicationReminderRepository.update(
            db=db,
            medication_reminder=medication_reminder,
            medication_reminder_data=medication_reminder_data
            )

    @staticmethod
    def delete_medication_reminder(
        db: Session,
        user_id: UUID,
        medication_reminder_id: UUID
        ) -> None:

        patient_profile = MedicationReminderService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        medication_reminder = MedicationReminderRepository.get_by_id(
            db=db,
            medication_reminder_id=medication_reminder_id
        )

        if medication_reminder is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medication reminder not found."
                )

        medication = MedicationRepository.get_by_id(
            db=db,
            medication_id=medication_reminder.medication_id
        )

        if medication is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated medication record not found."
                )

        if medication.patient_profile_id != patient_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this medication reminder."
                )

        MedicationReminderRepository.delete(
            db=db,
            medication_reminder=medication_reminder
        )