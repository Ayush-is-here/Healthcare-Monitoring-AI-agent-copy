from app.database.base import Base # Import your main Base registry
from app.models.user import User
from app.models.patient_profile import PatientProfile
from app.models.health_metric import HealthMetric
from app.models.medication import Medication
from app.models.appointment import Appointment
from app.models.medication_reminder import MedicationReminder

# Explicitly export them so Python exposes them cleanly
__all__ = ["Base", "User", "PatientProfile", "HealthMetric", "Medication", "Appointment", "MedicationReminder"]