from abc import ABC, abstractmethod
from app.domain.notification_content import NotificationContent
from app.dto.notification_dto import MedicationReminderNotificationDTO


class NotificationSender(ABC):

    @abstractmethod
    def send(
        self,
        notification: MedicationReminderNotificationDTO,
        content: NotificationContent
    ) -> None:
        
        pass

