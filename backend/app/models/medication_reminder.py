import uuid
from datetime import time, datetime
from sqlalchemy import ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

class MedicationReminder(Base):
    __tablename__ = "medication_reminders"
    __table_args__ = (
    Index(
        "ix_medication_reminders_reminder_time",
        "reminder_time"
    ),
)

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    medication_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("medications.id", ondelete="CASCADE"),
        nullable=False
    )

    reminder_time: Mapped[time] = mapped_column(
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        onupdate=datetime.now, # Automatically updates the timestamp on edits!
        nullable=False
    )

    # SQLAlchemy Relationship link to navigate back to the Parent medication cleanly
    medication: Mapped["Medication"] = relationship(
        "Medication",
        back_populates="medication_reminders"
    )
