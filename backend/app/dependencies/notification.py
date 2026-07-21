from app.services.email.email_client import EmailClient
from app.services.email.resend_email_client import ResendEmailClient
from app.services.senders.email_sender import EmailSender
from app.services.senders.notification_sender_factory import NotificationSenderFactory
from app.core.enums.notification_channel import NotificationChannel
from app.services.notification_service import NotificationService


def get_email_client() -> EmailClient:
    return ResendEmailClient()

def get_email_sender() -> EmailSender:

    email_client = get_email_client()

    return EmailSender(email_client=email_client)

def get_notification_sender_factory() -> NotificationSenderFactory:

    email_sender = get_email_sender()

    runtime_sender_map = {
        NotificationChannel.EMAIL: email_sender
    }

    return NotificationSenderFactory(sender_map=runtime_sender_map)

def get_notification_service() -> NotificationService:

    sender_factory = get_notification_sender_factory()

    return NotificationService(
        sender_factory = sender_factory
    )