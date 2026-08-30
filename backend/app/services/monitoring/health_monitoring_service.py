from uuid import UUID
from app.repositories.profile_repository import ProfileRepository
from sqlalchemy.orm import Session
import logging
from app.services.ai.health_insight_service import HealthInsightService
from app.services.notification_service import NotificationService
from app.services.ai.health_context_service import HealthContextService
from app.services.ai.rule_engine.engine import RuleEngine
from app.dto.notification.recipient import Recipient
from app.dto.notification.health_insight_notification import HealthInsightNotificationDTO


logger = logging.getLogger(__name__)


class HealthMonitoringService:

    def __init__(
            self,
            health_insight_service: HealthInsightService,
            notification_service: NotificationService
    ):
        self.health_insight_service = health_insight_service
        self.notification_service = notification_service


    def monitor_patient(
            self,
            db: Session,
            patient_profile_id: UUID
            ) -> None:

        patient_profile = ProfileRepository.get_by_id(
            db=db,
            patient_profile_id=patient_profile_id
        )

        if patient_profile is None:
            logger.warning(
                f"Patient not found with patient_id: {patient_profile_id}"
            )

            return

        health_context = HealthContextService.build(
            db=db,
            patient_profile_id=patient_profile_id
        )

        rule_results = RuleEngine.run(
            context=health_context
        )

        triggered_rules = rule_results.triggered_rule_results

        if not triggered_rules:
            return

        health_insight_response = self.health_insight_service.get_health_insight(
            health_context=health_context,
            triggered_rules=triggered_rules,
            user_id=patient_profile.user.id
            )

        recipient = Recipient(
            name=patient_profile.user.name,
            email=patient_profile.user.email
        )

        notification = HealthInsightNotificationDTO(
            recipient=recipient,
            summary=health_insight_response.summary,
            recommendations=health_insight_response.recommendations
        )

        self.notification_service.send(
            notification=notification
        )