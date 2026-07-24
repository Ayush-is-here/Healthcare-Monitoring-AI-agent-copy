from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.analytics.dashboard_analytics import DashboardAnalyticsResponse
from app.services.analytics.appointment_analytics import AppointmentAnalyticsService
from app.services.analytics.medication_analytics import MedicationAnalyticsService
from app.services.analytics.health_metric_analytics import HealthMetricAnalyticsService
from fastapi import HTTPException, status
from app.models.patient_profile import PatientProfile
from app.repositories.profile_repository import ProfileRepository

class AnalyticsService:

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
    def get_dashboard_analytics(
        db: Session,
        user_id: UUID
    ) -> DashboardAnalyticsResponse:

        patient_profile = AnalyticsService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        medication_analytics = MedicationAnalyticsService.get_summary(
            db=db,
            patient_profile_id=patient_profile.id,
        )

        appointment_analytics = AppointmentAnalyticsService.get_summary(
            db=db,
            patient_profile_id=patient_profile.id,
        )

        metric_analytics = HealthMetricAnalyticsService.get_metric_trends(
            db=db,
            patient_profile_id=patient_profile.id,
        )

        return DashboardAnalyticsResponse(
            metrics=metric_analytics,
            medications=medication_analytics,
            appointments=appointment_analytics,
        )