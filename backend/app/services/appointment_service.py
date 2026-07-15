from sqlalchemy.orm import Session
from uuid import UUID
from app.models.patient_profile import PatientProfile
from app.repositories.profile_repository import ProfileRepository
from fastapi import HTTPException, status
from app.repositories.appointment_repository import AppointmentRepository
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate


class AppointmentService:

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
    def create_appointment(
        db: Session,
        user_id: UUID,
        appointment_data: AppointmentCreate
        ) -> Appointment:
        
        patient_profile = AppointmentService._get_patient_profile(
            db=db,
            user_id=user_id
        )
        
        return AppointmentRepository.create(
            db=db,
            patient_profile_id=patient_profile.id,
            appointment_data=appointment_data
        )
    
    @staticmethod
    def list_appointments(
        db: Session,
        user_id: UUID,
        ) -> list[Appointment]:

        patient_profile = AppointmentService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        return AppointmentRepository.list_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile.id
        )
    
    @staticmethod
    def update_appointment(
        db: Session,
        user_id: UUID,
        appointment_id: UUID,
        appointment_data: AppointmentUpdate
        ) -> Appointment:

        patient_profile = AppointmentService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        appointment = AppointmentRepository.get_by_id(
            db=db,
            appointment_id=appointment_id
        )

        if appointment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found."
                )

        if patient_profile.id != appointment.patient_profile_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to modify this appointment."
                )

        return AppointmentRepository.update(
            db=db,
            appointment=appointment,
            appointment_data=appointment_data
        )
    
    @staticmethod
    def delete_appointment(
        db: Session,
        user_id: UUID,
        appointment_id: UUID,
    ) -> None:
        patient_profile = AppointmentService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        appointment = AppointmentRepository.get_by_id(
            db=db,
            appointment_id=appointment_id
        )

        if appointment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found."
                )

        if patient_profile.id != appointment.patient_profile_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to modify this appointment."
                )
        
        return AppointmentRepository.delete(
            db=db,
            appointment=appointment
        )