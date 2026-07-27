from pydantic import BaseModel, ConfigDict
from datetime import date, time
from app.models.enum import AppointmentStatus



class AppointmentContext(BaseModel):

    doctor_name: str

    appointment_date: date
    appointment_time: time

    purpose: str

    location: str | None = None
    notes: str | None = None

    status: AppointmentStatus

    model_config = ConfigDict(
        from_attributes=True
    )