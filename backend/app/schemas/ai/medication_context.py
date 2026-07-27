from pydantic import BaseModel, ConfigDict
from app.models.enum import DosageUnit, MedicationFrequency
from datetime import date

class MedicationContext(BaseModel):

    medicine_name: str
    dosage: float 
    dosage_unit: DosageUnit
    frequency: MedicationFrequency 
    is_active: bool
    start_date: date
    end_date: date | None = None
    instructions: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )