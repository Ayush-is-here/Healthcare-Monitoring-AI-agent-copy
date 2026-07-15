from app.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from sqlalchemy import ForeignKey, Enum
from datetime import date, time, datetime
from app.models.enum import AppointmentStatus


class Appointment(Base):
    __tablename__ = "appointments"


    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    patient_profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("patient_profiles.id"),
        nullable=False
    )

    doctor_name: Mapped[str] = mapped_column(
        nullable=False
    )

    appointment_date: Mapped[date] = mapped_column(
        nullable=False
    )

    appointment_time: Mapped[time] = mapped_column(
        nullable=False
    )

    purpose: Mapped[str] = mapped_column(
        nullable=False
    )

    location: Mapped[str | None] = mapped_column(
        nullable=True
    )

    notes: Mapped[str | None] =  mapped_column(
        nullable=True
    )

    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus),
        nullable=False,
        default=AppointmentStatus.PENDING
    )

    created_at: Mapped[datetime] = mapped_column(
        nullable=False,
        default=datetime.now
    )

    updated_at: Mapped[datetime] = mapped_column(
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now
    )

    patient_profile: Mapped["PatientProfile"] = relationship(
        "PatientProfile",
        back_populates="appointments"
    )
