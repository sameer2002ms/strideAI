from datetime import date

from .models import GoalSchedule


def should_create_checkin(
    *,
    schedule: GoalSchedule,
    today: date,
) -> bool:
    """
    Returns whether a check-in should be created
    for the given schedule on the given day.

    Version 1:
    - Daily goals only.
    """

    if schedule.frequency == GoalSchedule.Frequency.DAILY:
        return True

    return False