from pydantic import BaseModel
import uuid
from datetime import datetime
from app.models.enum import MetricSource, MetricType


class HealthMetricCreate(BaseModel):
    metric_type: MetricType
    value: float
    unit: str | None = None
    source: MetricSource = MetricSource.MANUAL
    recorded_at: datetime | None = None

class HealthMetricUpdate(BaseModel):
    metric_type: MetricType | None = None
    value: float | None = None
    unit: str | None = None
    recorded_at: datetime | None = None

class HealthMetricResponse(BaseModel):
    id: uuid.UUID
    patient_profile_id: uuid.UUID
    metric_type: MetricType
    value: float
    unit: str | None
    source: MetricSource
    recorded_at: datetime
    created_at: datetime

    model_config = {
        "from_attributes": True
    }