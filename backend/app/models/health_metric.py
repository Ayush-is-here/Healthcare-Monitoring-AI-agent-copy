from app.database.base import Base

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum, Index
from datetime import datetime
import uuid
from app.models.enum import MetricSource, MetricType


class HealthMetric(Base):
    __tablename__ = "health_metrics"

    __table_args__ = (
        Index(
            "ix_health_metrics_patient_profile_recorded_at",
            "patient_profile_id",
            "recorded_at",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    patient_profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("patient_profiles.id"),
        nullable=False
    )

    metric_type: Mapped[MetricType] = mapped_column(
        Enum(MetricType),
        nullable=False
    )

    value: Mapped[float] = mapped_column(
        nullable=False
    )

    unit: Mapped[str | None] = mapped_column(
        nullable=True
    )

    source: Mapped[MetricSource] = mapped_column(
        Enum(MetricSource),
        nullable=False,
        default=MetricSource.MANUAL
    )

    recorded_at: Mapped[datetime] = mapped_column(
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        nullable=False
    )

    patient_profile: Mapped["PatientProfile"] = relationship(
        "PatientProfile",
        back_populates="health_metrics"
    )