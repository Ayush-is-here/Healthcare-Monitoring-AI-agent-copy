from app.models.patient_profile import PatientProfile
from app.schemas.ai.patient_context import PatientContext
from datetime import datetime


class PatientContextBuilder:

    @staticmethod
    def _calculate_age(patient_profile: PatientProfile)-> int:
        today = datetime.now().date()
    
        dob = patient_profile.date_of_birth
    
        age = (
            today.year
            - dob.year
            -(
                (today.month, today.day)
                < (dob.month, dob.day)
            )
        )
        return age

    @staticmethod
    def build(
        patient_profile: PatientProfile
    ) -> PatientContext:

        age = PatientContextBuilder._calculate_age(patient_profile=patient_profile)

        return PatientContext(
            age=age,
            gender=patient_profile.gender,
            blood_group=patient_profile.blood_group,
            height_cm=patient_profile.height_cm,
            weight_kg=patient_profile.weight_kg,
            smoking_status=patient_profile.smoking_status,
            drinking_status=patient_profile.drinking_status,
            allergies=patient_profile.allergies,
            chronic_conditions=patient_profile.chronic_conditions
        )