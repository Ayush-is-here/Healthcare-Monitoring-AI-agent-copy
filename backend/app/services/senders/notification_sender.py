from abc import ABC, abstractmethod
from app.dto.notification.notification_content import NotificationContent
from app.dto.notification.medication_reminder_notification import MedicationReminderNotificationDTO


class NotificationSender(ABC):

    @abstractmethod
    def send(
        self,
        notification: MedicationReminderNotificationDTO,
        content: NotificationContent
    ) -> None:
        
        pass

