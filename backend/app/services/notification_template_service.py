from app.services.notification.template_registry import get_builder
from app.dto.notification.base_notification import BaseNotificationDTO
from app.dto.notification.notification_content import NotificationContent

class NotificationTemplateService:

    @staticmethod
    def build(notification: BaseNotificationDTO) -> NotificationContent:

        builder = get_builder(notification.notification_type)

        return builder(notification)