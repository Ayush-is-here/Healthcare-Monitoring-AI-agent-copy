from sqlalchemy.orm import Session
from uuid import UUID
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from sqlalchemy import select, func
from datetime import date, datetime
from app.models.enum import AppointmentStatus

class AppointmentRepository:

    @staticmethod
    def get_upcoming_appointments(
        db: Session,
        patient_profile_id: UUID
    ) -> Appointment | None:

        today_date = datetime.now().date()
        current_time = datetime.now().time()

        return db.scalar(
            select(Appointment).
            where(
                Appointment.patient_profile_id == patient_profile_id,
                Appointment.status.in_(
                    [
                        AppointmentStatus.SCHEDULED,
                        AppointmentStatus.PENDING
                    ]
                ),
                (Appointment.appointment_date > today_date) |
                (
                    (Appointment.appointment_date == today_date)  &
                    (Appointment.appointment_time >= current_time)
                )
            )
            .order_by(
                Appointment.appointment_date.asc(),
                Appointment.appointment_time.asc()
            )
            .limit(1)
        )

    @staticmethod
    def count_upcoming(
        db: Session,
        patient_profile_id: UUID
    ) -> int :

        today_date = datetime.now().date()
        current_time = datetime.now().time()

        return db.scalar(
            select(func.count())
            .select_from(Appointment)
            .where(
                Appointment.patient_profile_id == patient_profile_id,
                Appointment.status.in_(
                    [
                        AppointmentStatus.SCHEDULED,
                        AppointmentStatus.PENDING
                    ]
                ),
                (Appointment.appointment_date > today_date)
                |
                (
                    (Appointment.appointment_date == today_date)
                    &
                    (Appointment.appointment_time >= current_time)
                )
            )
        ) or 0

        



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

