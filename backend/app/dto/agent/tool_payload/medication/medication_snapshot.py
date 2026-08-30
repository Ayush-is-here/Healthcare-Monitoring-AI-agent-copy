from pydantic import BaseModel
from app.models.enum import DosageUnit, MedicationFrequency
from enum import Enum


class MedicationNormalizationStatus(str, Enum):

    MATCHED = "matched"
    NOT_FOUND = "not_found"
    LOOKUP_FAILED = "lookup_failed"


class MedicationSnapshot(BaseModel):

    medicine_name: str
    rxnorm_name: str | None
    rxcui: str | None

    dosage: float 
    dosage_unit: DosageUnit
    frequency: MedicationFrequency

    is_active: bool

    normalization_status: MedicationNormalizationStatus