from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.patient_profile import PatientProfile
from app.schemas.patient_profile import PatientProfileCreate


class ProfileRepository:

    @staticmethod
    def get_patient_profiles(
        db: Session,
        skip: int,
        limit: int
    ) -> list[PatientProfile]:

        return db.scalars(
                select(PatientProfile)
                .offset(skip)
                .limit(limit)
                ).all()
        


    @staticmethod
    def get_by_id(
        db: Session,
        patient_profile_id: UUID
    ) -> PatientProfile:
        
        return db.scalars(
            select(PatientProfile)
            .options(
                joinedload(PatientProfile.user)
            )
            .where(
                PatientProfile.id==patient_profile_id
                )
                ).one_or_none()


    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: UUID,
    ) -> PatientProfile | None:
        patient_profile = db.scalars(
            select(PatientProfile).where(PatientProfile.user_id == user_id)
        ).one_or_none()

        return patient_profile
    
    @staticmethod
    def create(
        db: Session,
        user_id: UUID,
        profile_data: PatientProfileCreate
    ) -> PatientProfile:
        
        patient_profile = PatientProfile(
            user_id=user_id,
            **profile_data.model_dump()
        )

        db.add(patient_profile)
        db.commit()
        db.refresh(patient_profile)

        return patient_profile