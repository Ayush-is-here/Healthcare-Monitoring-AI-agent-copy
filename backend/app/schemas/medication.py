from pydantic import BaseModel, ConfigDict
from app.models.enum import DosageUnit, MedicationFrequency
from datetime import date, datetime
from uuid import UUID


class MedicationCreate(BaseModel):
    medicine_name: str 
    dosage: float 
    dosage_unit: DosageUnit
    frequency: MedicationFrequency
    instructions: str | None = None
    start_date: date 
    end_date: date | None = None

    model_config = ConfigDict(
        extra="forbid"
    )

class MedicationResponse(BaseModel):
    id: UUID 
    medicine_name: str
    dosage: float
    dosage_unit: DosageUnit
    frequency: MedicationFrequency
    instructions: str | None = None
    start_date: date 
    end_date: date | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MedicationUpdate(BaseModel):
    medicine_name: str | None = None
    dosage: float | None = None
    dosage_unit: DosageUnit | None = None
    frequency: MedicationFrequency | None = None
    instructions: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None

    model_config = ConfigDict(
        extra="forbid"
    )