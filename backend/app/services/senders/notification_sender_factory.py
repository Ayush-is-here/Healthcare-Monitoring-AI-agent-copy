from app.services.senders.notification_sender import NotificationSender
from app.core.enums.notification_channel import NotificationChannel
from app.services.senders.email_sender import EmailSender

class NotificationSenderFactory:

    def __init__(
            self,
            sender_map: dict[NotificationChannel, NotificationSender]
            ):
        self._sender_map = sender_map


    def get_sender(
            self,
            channel: NotificationChannel
    ) -> NotificationSender:
        
        if channel not in self._sender_map:
            raise KeyError(f"No notification engine registered for channel: '{channel}'")

        return self._sender_map[channel]