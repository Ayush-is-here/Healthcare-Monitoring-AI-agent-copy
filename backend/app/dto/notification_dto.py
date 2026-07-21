from dataclasses import dataclass
from datetime import time

from app.models.enum import DosageUnit


@dataclass(frozen=True)
class MedicationReminderNotificationDTO:
    name: str
    email: str
    medicine_name: str
    dosage: float
    dosage_unit: DosageUnit
    reminder_time: time
    instructions: str | None