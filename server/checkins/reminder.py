from datetime import date

from checkins.selectors import get_pending_checkins_for_date


def get_todays_pending_summary(user):
    """
    Returns a lightweight summary of pending check-ins.
    This will later feed Telegram / AI / notifications.
    """

    today = date.today()

    checkins = get_pending_checkins_for_date(
        user=user,
        date_=today,
    )

    return [
        {
            "goal": c.goal.title,
            "checkin_id": c.id,
        }
        for c in checkins
    ]