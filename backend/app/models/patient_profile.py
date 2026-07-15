from __future__ import annotations
from app.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum, ForeignKey, Date, Float, String
import uuid
from datetime import datetime, date
from app.models.enum import Gender, BloodGroup, SmokingStatus, DrinkingStatus
from sqlalchemy.dialects.postgresql import JSONB

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    date_of_birth: Mapped[date]= mapped_column(
        Date,
        nullable=False
    )

    gender: Mapped[Gender] = mapped_column(
        Enum(Gender),
        nullable=False
    )

    height_cm: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    blood_group: Mapped[BloodGroup] = mapped_column(
        Enum(BloodGroup),
        nullable=False
    )

    smoking_status: Mapped[SmokingStatus] = mapped_column(
        Enum(SmokingStatus),
        nullable=False
    )

    drinking_status: Mapped[DrinkingStatus] = mapped_column(
        Enum(DrinkingStatus),
        nullable=False
    )

    allergies: Mapped[list[str] | None] = mapped_column(
        JSONB,
        nullable=True
    )

    chronic_conditions: Mapped[list[str] | None] = mapped_column(
        JSONB,
        nullable=True
    )

    emergency_contact_name: Mapped[str | None] = mapped_column(
        String(100), 
        nullable=True
    )

    emergency_contact_phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    emergency_contact_relationship: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        default = datetime.now,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        default = datetime.now,
        onupdate= datetime.now,
        nullable=False

    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="patient_profile"
    )

    health_metrics: Mapped[list["HealthMetric"]] = relationship(
        "HealthMetric",
        back_populates="patient_profile",
        cascade="all, delete-orphan"
    )

    medications: Mapped[list["Medication"]] = relationship(
        "Medication",
        back_populates="patient_profile",
        cascade="all, delete-orphan"
    )

    appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment",
        back_populates="patient_profile",
        cascade="all, delete-orphan"
    )