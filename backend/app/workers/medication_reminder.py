from app.database.session import SessionLocal
from app.repositories.medication_reminder_repository import MedicationReminderRepository
from datetime import datetime
from app.dto.notification_dto import MedicationReminderNotificationDTO
from app.dependencies.notification import get_notification_service



def process_due_reminders():
    db = SessionLocal()

    try:
        current_time = datetime.now().time().replace(
            second=0,
            microsecond=0
            )
        
        notifications = MedicationReminderRepository.get_due_medication_notifications(
            db=db,
            current_time=current_time
            )

        notification_service = get_notification_service()

        for notification in notifications:
            notification: MedicationReminderNotificationDTO

            notification_service.send_medication_reminder(
                notification=notification
            )
    finally:
        db.close()