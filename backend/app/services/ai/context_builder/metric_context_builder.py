from app.models.health_metric import HealthMetric
from app.schemas.ai.latest_metric_context import LatestMetricContext


class MetricContextBuilder:

    @staticmethod
    def build(
        metric: HealthMetric
    ) -> LatestMetricContext:

        return LatestMetricContext(
            metric_type=metric.metric_type,
            value=metric.value,
            unit=metric.unit,
            recorded_at=metric.recorded_at
        )