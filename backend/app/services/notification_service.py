from app.dto.notification.medication_reminder_notification import MedicationReminderNotificationDTO
from app.core.enums.notification_type import NotificationType
from app.services.senders.notification_sender_factory import NotificationSenderFactory
from app.services.notification_template_service import NotificationTemplateService
from app.services.notification_channel_router import NotificationChannelRouter

class NotificationService:

    def __init__(
            self,
            sender_factory: NotificationSenderFactory
    ):
        self._sender_factory = sender_factory

    
    def send(
        self,
        notification: MedicationReminderNotificationDTO,
        ) -> None:

        content = NotificationTemplateService.build(
            notification=notification
        )

        channels = NotificationChannelRouter.route(
            notification_type=notification.notification_type
        )

        for channel in channels:
            sender = self._sender_factory.get_sender(
                channel=channel
            )

            sender.send(
                notification=notification,
                content=content
            )