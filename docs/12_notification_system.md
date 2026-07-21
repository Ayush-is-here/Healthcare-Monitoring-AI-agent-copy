User creates Medication
        │
        ▼
PostgreSQL
        │
        ▼
Medication Reminder Table
        │
        ▼
⌚ Celery Beat (every minute)
        │
        ▼
Redis Queue
        │
        ▼
Celery Worker
        │
        ▼
Repository
        │
        ▼
MedicationReminderNotificationDTO
        │
        ▼
NotificationService
        │
        ├─────────────┐
        ▼             ▼
Template        Channel Router
        │             │
        └──────┬──────┘
               ▼
NotificationSenderFactory
               │
               ▼
EmailSender
               │
               ▼
ResendEmailClient
               │
               ▼
📧 Email Delivered