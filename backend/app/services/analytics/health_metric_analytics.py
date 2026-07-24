from uuid import UUID
from sqlalchemy.orm import Session

from app.schemas.analytics.dashboard_analytics import MetricTrendAnalytics
from app.repositories.health_metric_repository import HealthMetricRepository
from app.models.health_metric import HealthMetric

from datetime import datetime, timedelta
from app.schemas.analytics.dashboard_analytics import MetricTrendAnalytics

from collections import defaultdict

from app.models.enum import MetricType

class HealthMetricAnalyticsService:

    @staticmethod
    def _calculate_average(
        metrics: list[HealthMetric]
    ) -> float | None:

        if not metrics:
            return None

        total = sum(metric.value for metric in metrics)

        return total / len(metrics)

    @staticmethod
    def _calculate_percentage_change(
        recent_average: float | None,
        baseline_average: float | None
    ) -> float | None:
        if (
            recent_average is None
            or baseline_average is None
            or baseline_average == 0
            ):
            return None

        return (
            (recent_average - baseline_average)
            / baseline_average
        ) * 100
        

    @staticmethod
    def get_metric_trends(
        db: Session,
        patient_profile_id: UUID
    ) -> list[MetricTrendAnalytics]:

        latest_metrics = HealthMetricRepository.get_latest_metrics(
            db=db,
            patient_profile_id=patient_profile_id
        )

        now = datetime.now()

        since_7_days = now - timedelta(days=7)
        since_30_days = now - timedelta(days=30)

        metrics_last_30_days = HealthMetricRepository.get_metrics_since(
            db=db,
            patient_profile_id=patient_profile_id,
            since=since_30_days
        )

        metrics_by_type: defaultdict[MetricType, list[HealthMetric]] = defaultdict(list)

        for metric in metrics_last_30_days:
            metrics_by_type[metric.metric_type].append(metric)

        metric_trends: list[MetricTrendAnalytics] = []

        for latest_metric in latest_metrics:

            metric_history = metrics_by_type.get(
                latest_metric.metric_type,
                []
            )

            metric_last_7_days = [
                metric
                for metric in metric_history
                if metric.recorded_at >= since_7_days
            ]

            average_7_days = HealthMetricAnalyticsService._calculate_average(
                metric_last_7_days
            )

            average_30_days = HealthMetricAnalyticsService._calculate_average(
                metric_history
            )

            change_percentage = (
                HealthMetricAnalyticsService._calculate_percentage_change(
                    recent_average=average_7_days,
                    baseline_average=average_30_days
                )
            )

            metric_trends.append(
                MetricTrendAnalytics(
                    metric_type=latest_metric.metric_type,
                    latest_value=latest_metric.value,
                    last_updated=latest_metric.recorded_at,
                    average_7_days=average_7_days,
                    average_30_days=average_30_days,
                    change_percentage=change_percentage
                )
            )
        return metric_trends