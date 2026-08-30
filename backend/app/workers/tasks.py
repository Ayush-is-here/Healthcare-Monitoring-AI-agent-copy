from app.core.celery_app import celery_app
from app.workers.medication_reminder import process_due_reminders
from app.workers.health_monitor import run_health_monitoring_cycle


@celery_app.task
def process_due_reminders_task():
    process_due_reminders()


@celery_app.task
def process_health_monitoring_task():
    run_health_monitoring_cycle()