from dataclasses import dataclass
from datetime import time

from app.models.enum import DosageUnit

from app.dto.notification.base_notification import BaseNotificationDTO

from app.core.enums.notification_type import NotificationType


@dataclass(frozen=True)
class MedicationReminderNotificationDTO(BaseNotificationDTO):
    medicine_name: str
    dosage: float
    dosage_unit: DosageUnit
    reminder_time: time
    instructions: str | None

    def __post_init__(self):
        object.__setattr__(
            self,
            "notification_type",
            NotificationType.MEDICATION_REMINDER
        )