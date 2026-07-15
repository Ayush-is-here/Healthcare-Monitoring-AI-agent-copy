from pydantic import BaseModel, ConfigDict
from datetime import date, time, datetime
from uuid import UUID
from app.models.enum import AppointmentStatus



class AppointmentCreate(BaseModel):

    doctor_name: str
    appointment_date: date
    appointment_time: time
    purpose: str
    location: str | None = None
    notes: str | None = None

    model_config = ConfigDict(
        extra="forbid"
    )

class AppointmentResponse(BaseModel):

    id: UUID
    doctor_name: str
    appointment_date: date
    appointment_time: time
    purpose: str
    location: str | None
    notes: str | None
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

class AppointmentUpdate(BaseModel):
    
    doctor_name: str | None = None
    appointment_date: date | None = None
    appointment_time: time | None = None
    purpose: str | None = None
    location: str | None = None
    notes: str | None = None

    model_config = ConfigDict(
        extra="forbid"
    )