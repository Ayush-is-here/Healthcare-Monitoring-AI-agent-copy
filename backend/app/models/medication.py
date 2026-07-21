from app.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum
import uuid
from datetime import datetime, date
from app.models.enum import DosageUnit, MedicationFrequency


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    patient_profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("patient_profiles.id"),
        nullable=False
    )

    medicine_name: Mapped[str] = mapped_column(
        nullable=False
    )

    dosage: Mapped[float] = mapped_column(
        nullable=False
    )

    dosage_unit: Mapped[DosageUnit] = mapped_column(
        Enum(DosageUnit),
        nullable=False
    )

    frequency: Mapped[MedicationFrequency] = mapped_column(
        Enum(MedicationFrequency),
        nullable=False
    )

    instructions: Mapped[str | None] = mapped_column(
        nullable=True
    )

    start_date: Mapped[date] = mapped_column(
        default=date.today,
        nullable=False
    )

    end_date: Mapped[date | None] = mapped_column(
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now
    )

    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    patient_profile: Mapped["PatientProfile"] = relationship(
        "PatientProfile",
        back_populates="medications"
    )

    medication_reminders: Mapped[list["MedicationReminder"]] = relationship(
        "MedicationReminder",
        back_populates="medication",
        cascade="all, delete-orphan"
    )