from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from app.models.enum import Gender, BloodGroup, DrinkingStatus, SmokingStatus
from datetime import datetime, date

class PatientProfileCreate(BaseModel):
    date_of_birth: date
    gender: Gender
    height_cm: float = Field(
        gt=30.0,
        lt=300.0,
        description="Patient's height measured in centimeters (must be between 30.0 and 300.0)"
    )
    blood_group: BloodGroup
    smoking_status: SmokingStatus
    drinking_status: DrinkingStatus

    allergies: list[str] | None = Field(
        default=None,
        description="List of known drug, food, or environmental allergens for context injection"
    )

    chronic_conditions: list[str] | None= Field(
        default=None,
        description="List of diagnosed long-term medical conditions (e.g., Diabetes, Hypertension)"
    )

    emergency_contact_name: str | None = Field(
        default=None,
        max_length=100,
        description="Full legal name of the primary emergency contact person"
    )
    emergency_contact_phone: str | None = Field(
        default=None, 
        max_length=20,
        description="Contact telephone number for emergency notification"
    )
    
    emergency_contact_relationship: str | None = Field(
        default=None, 
        max_length=50,
        description="Relationship of the contact person to the patient (e.g., Spouse, Parent)"
    )

    model_config = ConfigDict(
    extra="forbid"
    )

class PatientProfileResponse(PatientProfileCreate):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )

class PatientProfileUpdate(BaseModel):
    date_of_birth: date | None = None
    gender: Gender | None = None
    height_cm: float | None  = Field(
        default=None,
        gt=30.0,
        lt=300.0
    )
    blood_group: BloodGroup | None = Field(None)
    smoking_status: SmokingStatus | None = Field(None)
    drinking_status: DrinkingStatus | None = Field(None)
    allergies: list[str] | None = None

    chronic_conditions: list[str] | None = None

    emergency_contact_name: str | None = Field(
        default=None,
        max_length=100
    )

    emergency_contact_phone: str | None = Field(
        default=None,
        max_length=20
    )

    emergency_contact_relationship: str | None = Field(
        default=None,
        max_length=50
    )
    model_config = ConfigDict(
        extra="forbid"
    )