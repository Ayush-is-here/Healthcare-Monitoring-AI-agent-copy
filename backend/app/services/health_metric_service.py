
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.health_metric import HealthMetric
from app.schemas.health_metric import HealthMetricCreate, HealthMetricUpdate
from app.repositories.health_metric_repository import HealthMetricRepository
from app.models.patient_profile import PatientProfile
from app.repositories.profile_repository import ProfileRepository
from fastapi import HTTPException, status

class HealthMetricService:

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
    def create_metric(
        db: Session,
        user_id: UUID,
        metric_data: HealthMetricCreate
    ) -> HealthMetric:
        
        patient_profile = HealthMetricService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        return HealthMetricRepository.create(
            db=db,
            patient_profile_id=patient_profile.id,
            metric_data=metric_data
        )
    
    @staticmethod
    def list_metrics(
        db: Session,
        user_id: UUID
    ) -> list[HealthMetric]:
        
        patient_profile = HealthMetricService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        return HealthMetricRepository.list_by_patient_profile(
            db=db,
            patient_profile_id=patient_profile.id
        )
    
    @staticmethod
    def update_metric(
        db: Session,
        user_id: UUID,
        metric_id: UUID,
        metric_data: HealthMetricUpdate
    ) -> HealthMetric:
        
        patient_profile = HealthMetricService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        health_metric = HealthMetricRepository.get_by_id(
             db=db,
             metric_id=metric_id
             )
        if health_metric is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Health metric not found."
            )   

        if patient_profile.id != health_metric.patient_profile_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to modify this health metric."
                )
        
        return HealthMetricRepository.update(
                db=db,
                health_metric=health_metric,
                metric_data=metric_data
            )
    @staticmethod
    def delete(
        db: Session,
        user_id: UUID,
        metric_id: UUID
    ) -> None:
        
        patient_profile = HealthMetricService._get_patient_profile(
            db=db,
            user_id=user_id
        )

        health_metric = HealthMetricRepository.get_by_id(
            db=db,
            metric_id=metric_id
        )

        if health_metric is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Health metric not found."
                )

        if patient_profile.id != health_metric.patient_profile_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to modify this health metric."
                )

        return HealthMetricRepository.delete(
            db=db,
            health_metric=health_metric
        )