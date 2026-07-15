from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.medication import MedicationCreate, MedicationUpdate
from app.models.medication import Medication
from sqlalchemy import select


class MedicationRepository:

    @staticmethod
    def create(
        db: Session,
        patient_profile_id: UUID,
        medication_data: MedicationCreate
    ) -> Medication:
        
        medication = Medication(
            patient_profile_id=patient_profile_id,
            **medication_data.model_dump()
        )

        db.add(medication)
        db.commit()
        db.refresh(medication)

        return medication
    
    @staticmethod
    def list_by_patient_profile(
        db: Session,
        patient_profile_id: UUID
    ) -> list[Medication]:
        
        return db.scalars(
            select(Medication).where(Medication.patient_profile_id==patient_profile_id).
            order_by(Medication.start_date.desc())
        ).all()
    
    @staticmethod
    def get_by_id(
        db: Session,
        medication_id: UUID
    ) -> Medication | None:
        
        return db.scalars(
            select(Medication).where(Medication.id==medication_id)
        ).one_or_none()
    
    @staticmethod
    def update(
        db: Session,
        medication: Medication,
        medication_data: MedicationUpdate
    ) -> Medication :
        
        update_data = medication_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(medication, key, value)

        db.commit()
        db.refresh(medication)

        return medication
    
    @staticmethod
    def delete(
        db: Session,
        medication: Medication
    ) -> None:
        db.delete(medication)
        db.commit()