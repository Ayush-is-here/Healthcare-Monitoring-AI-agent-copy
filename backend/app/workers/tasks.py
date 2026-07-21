from app.core.celery_app import celery_app
from app.workers.medication_reminder import process_due_reminders


@celery_app.task
def process_due_reminders_task():
    process_due_reminders()