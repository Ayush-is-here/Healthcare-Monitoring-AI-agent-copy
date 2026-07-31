from app.services.senders.notification_sender import NotificationSender
from app.dto.notification.notification_content import NotificationContent
from app.dto.notification.medication_reminder_notification import MedicationReminderNotificationDTO
from app.services.email.email_client import EmailClient

class EmailSender(NotificationSender):

    def __init__(
            self,
            email_client: EmailClient
    ):
        self._email_client = email_client
        
    def send(
            self,
            notification: MedicationReminderNotificationDTO,
            content: NotificationContent
    ) -> None :
        
        self._email_client.send(
            recipient=notification.recipient.email,
            subject=content.title,
            body=content.body
        )
        