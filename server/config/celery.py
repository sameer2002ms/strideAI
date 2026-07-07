import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

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

    "daily-reminders": {
        "task": "checkins.tasks_reminder.send_daily_reminders",
        "schedule": crontab(minute="*/300"),  # TEMP TEST
    },
}