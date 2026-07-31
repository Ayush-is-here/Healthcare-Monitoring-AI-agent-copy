from app.core.enums.notification_channel import NotificationChannel
from app.core.enums.notification_type import NotificationType



class NotificationChannelRouter:

    _NOTIFICATION_CHANNEL_MAP = {
            NotificationType.MEDICATION_REMINDER: [
                NotificationChannel.EMAIL
            ],
            NotificationType.HEALTH_INSIGHT: [
                NotificationChannel.EMAIL
            ]
        }

    @classmethod
    def route(
        cls,
        notification_type: NotificationType
    ) -> list[NotificationChannel]:
        
        return cls._NOTIFICATION_CHANNEL_MAP[notification_type]