from sqlalchemy.orm import Session
from uuid import UUID
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from sqlalchemy import select

class AppointmentRepository:

    @staticmethod
    def create(
        db: Session,
        patient_profile_id: UUID,
        appointment_data: AppointmentCreate
    ) -> Appointment:
        
        appointment = Appointment(
            patient_profile_id=patient_profile_id,
            **appointment_data.model_dump()
        )

        db.add(appointment)
        db.commit()
        db.refresh(appointment)

        return appointment
    
    @staticmethod
    def list_by_patient_profile(
        db:Session,
        patient_profile_id: UUID,
    ) -> list[Appointment]:
        
        return db.scalars(
            select(Appointment).where(Appointment.patient_profile_id==patient_profile_id).
            order_by(Appointment.appointment_date.asc(), Appointment.appointment_time.asc())
        ).all()
    
    @staticmethod
    def get_by_id(
        db: Session,
        appointment_id: UUID
    ) -> Appointment | None:
        
        return db.scalars(
            select(Appointment).where(Appointment.id == appointment_id)
        ).one_or_none()
    
    @staticmethod
    def update(
        db: Session,
        appointment: Appointment,
        appointment_data: AppointmentUpdate
    ) -> Appointment:
        
        update_data = appointment_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():

            setattr(appointment, key, value)

        db.commit()
        db.refresh(appointment)

        return appointment
    
    @staticmethod
    def delete(
        db: Session,
        appointment: Appointment
    ) -> None:
        
        db.delete(appointment)
        db.commit()

