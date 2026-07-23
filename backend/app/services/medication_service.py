from sqlalchemy.orm import Session
from uuid import UUID
from app.models.patient_profile import PatientProfile
from app.repositories.profile_repository import ProfileRepository
from fastapi import HTTPException, status
from app.schemas.medication import MedicationCreate, MedicationUpdate
from app.models.medication import Medication
from app.repositories.medication_repository import MedicationRepository

class MedicationService:

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
    def create_medication(
        medication_data: MedicationCreate,
        user_id: UUID,
        db: Session
    ) -> Medication:
        
        patient_profile = MedicationService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        return MedicationRepository.create(
            db=db,
            patient_profile_id=patient_profile.id,
            medication_data=medication_data
        )
    
    @staticmethod
    def list_medications(
        db: Session,
        user_id: UUID
    ) -> list[Medication]:
        
        patient_profile = MedicationService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        return MedicationRepository.list_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile.id
        )
    
    @staticmethod
    def update_medication(
        db: Session,
        user_id: UUID,
        medication_id: UUID,
        medication_data: MedicationUpdate
    ) -> Medication:
        
        patient_profile = MedicationService._get_patient_profile(
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
                detail="Medication not found."
            )

        if patient_profile.id != medication.patient_profile_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to modify this medication."
                )
        
        return MedicationRepository.update(
            db=db,
            medication=medication,
            medication_data=medication_data
        )
    
    @staticmethod
    def delete_medication(
        db: Session,
        user_id: UUID,
        medication_id: UUID
    ) -> None:
        
        patient_profile = MedicationService._get_patient_profile(
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
                detail="Medication not found."
            )
        
        if medication.patient_profile_id != patient_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to modify this medication."
                )

        MedicationRepository.delete(
            db=db,
            medication=medication
        )