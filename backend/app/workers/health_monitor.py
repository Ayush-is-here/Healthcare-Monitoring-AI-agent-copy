from app.database.session import SessionLocal
from app.repositories.profile_repository import ProfileRepository
import logging
from app.dependencies.monitoring import get_health_monitoring_service

logger = logging.getLogger(__name__)


def run_health_monitoring_cycle():

    current_skip = 0
    BATCH_SIZE = 100

    db = SessionLocal()
    health_monitoring_service = get_health_monitoring_service()

    try:
        while True:

            patient_page = ProfileRepository.get_patient_profiles(
                db=db,
                skip=current_skip,
                limit=BATCH_SIZE
            )

            if not patient_page:
                break

            for patient in patient_page:
                try:
                    health_monitoring_service.monitor_patient(
                        db=db,
                        patient_profile_id=patient.id
                    )
                except Exception:
                    logger.exception(
                        f"Failed to monitor patient {patient.id}"
                    )
                    continue

            current_skip+=BATCH_SIZE

    finally:
        db.close()