from pydantic import BaseModel, ConfigDict
from app.models.enum import MetricType
from datetime import datetime



class PatientSummary(BaseModel):
    full_name: str
    age: int

    model_config = ConfigDict(from_attributes=True)


class HealthMetricSnapshot(BaseModel):
    metric_type: MetricType
    value: float
    unit: str | None
    last_updated: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

class MedicationSummary(BaseModel):
    active_medications: int

    model_config = ConfigDict(
        from_attributes=True
    )

class ReminderSummary(BaseModel):
    reminders_today: int

    model_config=ConfigDict(
        from_attributes=True
    )

class AppointmentSummary(BaseModel):
    next_appointment: datetime | None

    model_config = ConfigDict(
        from_attributes=True
    )

class DashboardOverviewResponse(BaseModel):
    patient: PatientSummary
    medications: MedicationSummary
    reminders: ReminderSummary
    appointment: AppointmentSummary
    health_metric_snapshot: list[HealthMetricSnapshot]

    model_config = ConfigDict(
        from_attributes=True
    )
class DashboardAnalyticsResponse(BaseModel):
    metrics: list[HealthMetricSnapshot]

    model_config = ConfigDict(
        from_attributes=True
    )