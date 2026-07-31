from typing import Callable
from app.core.enums.notification_type import NotificationType
from app.dto.notification.notification_content import NotificationContent
from app.dto.notification.base_notification import BaseNotificationDTO

from app.services.notification.templates.medication_reminder_template import (
    build_medication_reminder
)

from app.services.notification.templates.health_insight_template import (
    build_health_insight_template
)



_TEMPLATE_REGISTRY: dict[
    NotificationType,
    Callable[[BaseNotificationDTO], NotificationContent]
] = {
    NotificationType.MEDICATION_REMINDER: build_medication_reminder,
    NotificationType.HEALTH_INSIGHT: build_health_insight_template
}



def get_builder(
        notification_type: NotificationType
) -> Callable[[BaseNotificationDTO], NotificationContent]:

    try:
        return _TEMPLATE_REGISTRY[notification_type]

    except KeyError as e:
        raise ValueError(
            f"No template builder registered for {notification_type}"
        ) from e