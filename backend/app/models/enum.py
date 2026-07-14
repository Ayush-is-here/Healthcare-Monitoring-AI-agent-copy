from enum import Enum

class UserRole(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    CAREGIVER = "caregiver"
    ADMIN = "admin"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    TRANSGENDER = "transgender"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class BloodGroup(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"


class SmokingStatus(str, Enum):
    NEVER = "never_smoked"
    CURRENT_REGULAR = "current_regular"
    CURRENT_OCCASIONAL = "current_occasional"
    FORMER = "former_smoker"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class DrinkingStatus(str, Enum):
    NEVER = "never_drank"
    CURRENT_REGULAR = "current_regular"    
    CURRENT_SOCIAL = "current_social"      
    FORMER = "former_drinker"               
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class MetricType(str, Enum):
    HEART_RATE = "heart_rate"
    STEPS = "steps"
    CALORIES_BURNED = "calories_burned"
    WEIGHT = "weight"
    BLOOD_PRESSURE_SYSTOLIC = "blood_pressure_systolic"
    BLOOD_PRESSURE_DIASTOLIC = "blood_pressure_diastolic"
    BLOOD_GLUCOSE = "blood_glucose"
    SPO2 = "spo2"
    BODY_TEMPERATURE = "body_temperature"
    SLEEP_DURATION = "sleep_duration"

class MetricSource(str, Enum):
    MANUAL = "manual"
    GOOGLE_HEALTH = "google_health"
    FITBIT = "fitbit"
    