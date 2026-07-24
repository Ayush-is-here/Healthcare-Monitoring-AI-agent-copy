from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.health_metric import HealthMetric
from app.schemas.health_metric import HealthMetricCreate, HealthMetricUpdate

from datetime import datetime
from app.models.enum import MetricType


class HealthMetricRepository:

    @staticmethod
    def get_latest_metrics(
        db: Session,
        patient_profile_id: UUID
    ) -> list[HealthMetric]:

        latest_metric = (
            select(
                HealthMetric.metric_type,
                func.max(HealthMetric.recorded_at).label("latest_recorded_at")
            )
            .where(
            HealthMetric.patient_profile_id == patient_profile_id
            )
            .group_by(
                HealthMetric.metric_type
            )
            .subquery()
            )

        return db.scalars(
            select(HealthMetric)
            .join(
                latest_metric,
                (HealthMetric.metric_type == latest_metric.c.metric_type)
                &
                (HealthMetric.recorded_at == latest_metric.c.latest_recorded_at)
            )
            .where(
                HealthMetric.patient_profile_id == patient_profile_id
            )
            .order_by(
                HealthMetric.metric_type
            )
            ).all()

    @staticmethod
    def get_metrics_since(
        db: Session,
        patient_profile_id: UUID,
        since: datetime
    ) -> list[HealthMetric]:

        return db.scalars(
                select(HealthMetric)
                .where(
                    HealthMetric.patient_profile_id == patient_profile_id,
                    HealthMetric.recorded_at >= since
                )
                .order_by(
                    HealthMetric.recorded_at.desc()
                )
            ).all()


    @staticmethod
    def create(
            db: Session,
            patient_profile_id: UUID,
            metric_data: HealthMetricCreate
    ) -> HealthMetric:
        
        health_metric = HealthMetric(
            patient_profile_id=patient_profile_id,
            **metric_data.model_dump()
        )

        db.add(health_metric)
        db.commit()
        db.refresh(health_metric)

        return health_metric
    
    @staticmethod
    def list_by_patient_profile(
        db: Session,
        patient_profile_id: UUID
    ) -> list[HealthMetric] :
        
        return db.scalars(
            select(HealthMetric).where(
                HealthMetric.patient_profile_id == patient_profile_id)
                .order_by(HealthMetric.recorded_at)
        ).all()
    
    @staticmethod
    def get_by_id(
        db: Session,
        metric_id: UUID
    ) -> HealthMetric | None:
        
        return db.scalars(
            select(HealthMetric).where(HealthMetric.id == metric_id)
        ).one_or_none()
    
    @staticmethod
    def update(
        db: Session,
        health_metric: HealthMetric,
        metric_data: HealthMetricUpdate
    ) -> HealthMetric :
        
        update_data=metric_data.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(
                health_metric,
                key,
                value
            )
        
        db.commit()
        db.refresh(health_metric)

        return health_metric
    
    @staticmethod
    def delete(
        db: Session,
        health_metric: HealthMetric
    )  -> None:
        db.delete(health_metric)
        db.commit()