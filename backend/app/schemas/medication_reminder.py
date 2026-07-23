from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import time, datetime


class MedicationReminderCreate(BaseModel):
    medication_id: UUID
    reminder_time: time

    model_config = ConfigDict(
        extra="forbid"
    )

class MedicationReminderUpdate(BaseModel):
    reminder_time: time | None = None
    is_active: bool | None = None

    model_config = ConfigDict(
        extra="forbid"
    )

class MedicationReminderResponse(BaseModel):
    id: UUID
    medication_id: UUID
    reminder_time: time
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )