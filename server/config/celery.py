import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from celery import Celery
from celery.schedules import crontab


app = Celery("strideAI")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request}")


app.conf.beat_schedule = {
    "daily-checkins": {
        "task": "automation.tasks.generate_daily_checkins",
        "schedule": crontab(hour=0, minute=0),
    },

    "pending-reminders": {
        "task": "automation.tasks.send_pending_reminders",
        "schedule": crontab(minute="*"),
    },
}