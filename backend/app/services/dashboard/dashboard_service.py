from sqlalchemy.orm import Session
from uuid import UUID
from app.models.patient_profile import PatientProfile
from app.schemas.dashboard.dashboard import DashboardOverviewResponse
from app.repositories.profile_repository import ProfileRepository
from fastapi import HTTPException, status
from app.repositories.medication_repository import MedicationRepository
from app.repositories.medication_reminder_repository import MedicationReminderRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.health_metric_repository import HealthMetricRepository
from app.schemas.dashboard.dashboard import *
from datetime import datetime


class DashboardService:

    @staticmethod
    def _calculate_age(patient_profile: PatientProfile)-> int:
        today = datetime.now().date()

        dob = patient_profile.date_of_birth

        age = (
            today.year
            - dob.year
            -(
                (today.month, today.day)
                < (dob.month, dob.day)
            )
        )
        return age

    @staticmethod
    def _get_patient_profile(
        db:Session,
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
    def get_overview(
        db:Session,
        user_id: UUID
    ) -> DashboardOverviewResponse:

        patient_profile = DashboardService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        active_medication_count = MedicationRepository.count_active_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile.id
        )

        active_reminders_count = MedicationReminderRepository.count_due_today(
            db=db,
            patient_profile_id=patient_profile.id
        )

        next_appointment = AppointmentRepository.get_upcoming_appointments(
            db=db,
            patient_profile_id=patient_profile.id
        )

        if next_appointment is not None:
            next_appointment_datetime = datetime.combine(
            next_appointment.appointment_date,
            next_appointment.appointment_time
        )
        else:
            next_appointment_datetime = None

        latest_health_metrics = HealthMetricRepository.get_latest_metrics(
            db=db,
            patient_profile_id=patient_profile.id
            )

        patient_summary = PatientSummary(
            full_name=patient_profile.user.name,
            age=DashboardService._calculate_age(patient_profile=patient_profile)
        )

        medication_summary = MedicationSummary(
            active_medications=active_medication_count
        )

        reminder_summary = ReminderSummary(
            reminders_today=active_reminders_count
        )

        appointment_summary = AppointmentSummary(
            next_appointment=next_appointment_datetime
        )

        health_metrics_snapshot = [
            HealthMetricSnapshot(
                metric_type=metric.metric_type,
                value=metric.value,
                unit=metric.unit,
                last_updated=metric.recorded_at
                )
                for metric in latest_health_metrics
                ]

        return DashboardOverviewResponse(
            patient=patient_summary,
            medications=medication_summary,
            reminders=reminder_summary,
            appointment=appointment_summary,
            health_metric_snapshot=health_metrics_snapshot
        )