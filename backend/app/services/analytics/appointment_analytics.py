from uuid import UUID
from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.analytics.dashboard_analytics import AppointmentAnalytics
from app.repositories.appointment_repository import AppointmentRepository


class AppointmentAnalyticsService:

    @staticmethod
    def get_summary(
        db: Session,
        patient_profile_id: UUID
    ) -> AppointmentAnalytics:

        next_appointment = AppointmentRepository.get_upcoming_appointments(
            db=db,
            patient_profile_id=patient_profile_id
        )

        if next_appointment is not None:
            next_appointment_datetime = datetime.combine(
            next_appointment.appointment_date,
            next_appointment.appointment_time
            )
        else:
            next_appointment_datetime = None

        upcoming_count = AppointmentRepository.count_upcoming(
            db=db,
            patient_profile_id=patient_profile_id
        )

        return AppointmentAnalytics(
            next_appointment= next_appointment_datetime,
            upcoming_count=upcoming_count
        )