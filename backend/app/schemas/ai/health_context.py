from pydantic import BaseModel, ConfigDict, Field
from app.schemas.ai.appointment_context import AppointmentContext
from app.schemas.ai.latest_metric_context import LatestMetricContext
from app.schemas.ai.medication_context import MedicationContext
from app.schemas.ai.patient_context import PatientContext
from datetime import datetime


class HealthContext(BaseModel):
    patient: PatientContext
    latest_metrics: list[LatestMetricContext] = Field(
        default_factory=list
    )
    medications: list[MedicationContext] = Field(
        default_factory=list
    )
    appointments: list[AppointmentContext] = Field(
        default_factory=list
    )
    generated_at: datetime
    context_version: str = "1.0"

    model_config = ConfigDict(
        from_attributes=True
    )