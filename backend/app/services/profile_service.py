from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.patient_profile import PatientProfile
from app.schemas.patient_profile import PatientProfileUpdate, PatientProfileCreate
from app.repositories.profile_repository import ProfileRepository

class ProfileService:


    @staticmethod
    def update_profile(
        db: Session,
        user_id: UUID,
        profile_data: PatientProfileUpdate
    ) -> PatientProfile:
        
        patient_profile = ProfileRepository.get_by_user_id(
            db=db,
            user_id=user_id
        )

        if patient_profile is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patient profile not found")
    
        update_data = profile_data.model_dump(exclude_unset=True)

        if not update_data:
            return patient_profile

        for key, value in update_data.items():
            setattr(patient_profile, key, value)

        db.commit()
        db.refresh(patient_profile)

        return patient_profile
    
    @staticmethod
    def create_profile(
        db: Session,
        user_id: UUID,
        profile_data: PatientProfileCreate
    )-> PatientProfile:
        existing_profile = ProfileRepository.get_by_user_id(
            db =db,
            user_id=user_id
        )

        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Patient profile already exists."
            )
        
        return ProfileRepository.create(
            db=db,
            user_id=user_id,
            profile_data=profile_data
        )
    @staticmethod
    def get_profile(
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
                detail="Patient profile not found"
            )
        
        return patient_profile