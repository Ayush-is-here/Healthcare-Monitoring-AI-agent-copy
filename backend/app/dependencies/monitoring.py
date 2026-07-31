from app.dependencies.ai import get_health_insight_service
from app.services.monitoring.health_monitoring_service import HealthMonitoringService
from app.dependencies.notification import get_notification_service



def get_health_monitoring_service() -> HealthMonitoringService:


    return HealthMonitoringService(
        health_insight_service=get_health_insight_service(),
        notification_service=get_notification_service()
    )
