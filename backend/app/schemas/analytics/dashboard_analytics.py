from pydantic import BaseModel, ConfigDict, Field
from app.models.enum import MetricType
from datetime import datetime

class MetricTrendAnalytics(BaseModel):
    metric_type: MetricType
    latest_value: float
    last_updated: datetime | None = None
    average_7_days: float | None = None
    average_30_days: float | None = None
    change_percentage: float | None = None

    model_config = ConfigDict(from_attributes=True)


class MedicationAnalytics(BaseModel):
    active_medications: int 
    reminders_today: int
    adherence_rate: float = Field(0.0)

    model_config = ConfigDict(
        from_attributes=True
    )

class AppointmentAnalytics(BaseModel):
    next_appointment: datetime | None = None
    upcoming_count: int = 0

    model_config = ConfigDict(
        from_attributes=True
    )

class DashboardAnalyticsResponse(BaseModel):
    metrics: list[MetricTrendAnalytics]
    medications: MedicationAnalytics
    appointments: AppointmentAnalytics

    model_config = ConfigDict(
        from_attributes=True
    )