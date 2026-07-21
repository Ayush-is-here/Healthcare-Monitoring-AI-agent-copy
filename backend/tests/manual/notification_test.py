from app.dependencies.notification import get_notification_service
from app.dto.notification_dto import MedicationReminderNotificationDTO
from app.core.enums.notification_type import NotificationType

notification = MedicationReminderNotificationDTO(
    name = "Ayush",
    email = "ayush18bhatt@gmail.com",
    medicine_name = "Paracetamol",
    dosage = "500",
    dosage_unit="mg",
    reminder_time="1 P.M.",
    instructions = "Take after food"
)

notification_service = get_notification_service()

notification_service.send_medication_reminder(
    notification=notification
)