from app.database.base import Base # Import your main Base registry
from app.models.user import User
from app.models.patient_profile import PatientProfile

# Explicitly export them so Python exposes them cleanly
__all__ = ["Base", "User", "PatientProfile"]