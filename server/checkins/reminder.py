from datetime import date

from checkins.selectors import get_pending_checkins_for_date


def get_todays_pending_summary(user):
    """
    Build reminder context for the accountability engine.

    This data will be consumed by:
    - BehaviorEngine
    - NotificationDispatcher
    """

    today = date.today()

    checkins = get_pending_checkins_for_date(
        user=user,
        date_=today,
    )

    goals = []

    for checkin in checkins:
        goals.append(
            {
                "checkin_id": checkin.id,
                "goal": checkin.goal.title,
                "description": checkin.goal.description,
                "status": checkin.status,
                "date": str(checkin.date),
            }
        )

    return {
        "pending_count": len(goals),
        "goals": goals,
    }