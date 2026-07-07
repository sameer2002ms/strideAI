from celery import shared_task
from django.contrib.auth import get_user_model

from checkins.reminder import get_todays_pending_summary


User = get_user_model()


@shared_task
def send_daily_reminders():
    """
    Future: send Telegram / WhatsApp / push notifications.
    For now: just logs structured data.
    """

    for user in User.objects.all():

        pending = get_todays_pending_summary(user)

        if not pending:
            continue

        print(f"[REMINDER] User {user.id}", pending)

    return "reminders processed"