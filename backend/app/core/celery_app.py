from celery import Celery
from app.core.config import settings
from celery.schedules import crontab


from urllib.parse import urlparse

print("DEBUG REDIS SCHEME:", repr(urlparse(settings.redis_url).scheme))
print("DEBUG REDIS HOST:", repr(urlparse(settings.redis_url).hostname))
print("DEBUG REDIS URL EMPTY:", not bool(settings.redis_url))
print("DEBUG REDIS RAW:", repr(settings.redis_url))

celery_app = Celery("healthcare-ai")

celery_app.conf.broker_url = settings.redis_url
celery_app.conf.result_backend = settings.redis_url


celery_app.conf.broker_use_ssl = {
    "ssl_cert_reqs": "CERT_REQUIRED",
}

celery_app.conf.redis_backend_use_ssl = {
    "ssl_cert_reqs": "CERT_REQUIRED",
}


celery_app.conf.accept_content = ["json"]
celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"

celery_app.conf.timezone = "Asia/Kolkata"

celery_app.autodiscover_tasks(["app.workers"])


celery_app.conf.beat_schedule = {
    "check-medication-reminder-every-minute":{
        "task": "app.workers.tasks.process_due_reminders_task",
        "schedule": crontab(minute="*")
    },

    "run-health-monitoring-every-12-hour": {
        "task": "app.workers.tasks.process_health_monitoring_task",
        "schedule": crontab(minute=0, hour="*/12")
    }
}