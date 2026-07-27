from pydantic import BaseModel, ConfigDict, Field
from app.models.enum import Gender, BloodGroup, SmokingStatus, DrinkingStatus


class PatientContext(BaseModel):
    age: int | None = None
    gender: Gender | None = None
    blood_group: BloodGroup | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    smoking_status: SmokingStatus | None = None
    drinking_status: DrinkingStatus | None = None
    allergies: list[str] = Field(default_factory=list)
    chronic_conditions: list[str] = Field(default_factory=list)

    model_config = ConfigDict(
        from_attributes=True
    )