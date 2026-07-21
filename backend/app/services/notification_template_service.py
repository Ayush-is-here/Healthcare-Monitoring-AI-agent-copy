from app.dto.notification_dto import MedicationReminderNotificationDTO
from app.domain.notification_content import NotificationContent


class NotificationTemplateService:

    @staticmethod
    def build_medication_reminder(
        notification: MedicationReminderNotificationDTO
    ) -> NotificationContent:
            
        if notification.instructions:
            instruction_content = f"Instructions:\n{notification.instructions}"
        else:
            instruction_content = ""

       
        return NotificationContent(
        title="Medication Reminder",
        body=f"""Hello {notification.name},

This is a reminder to take your medication.

Medication:
{notification.medicine_name}

Dosage:
{notification.dosage} {notification.dosage_unit.value}

{instruction_content}""".strip() 
        )
