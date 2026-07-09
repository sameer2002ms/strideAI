from datetime import date

from checkins.models import CheckIn


class ReminderEngine:
    """
    Builds reminder payloads for the goals whose reminder
    time is currently due.
    """

    @staticmethod
    def build_payload(*, user, goals):

        today = date.today()

        checkins = (
            CheckIn.objects
            .filter(
                goal__in=goals,
                date=today,
                status=CheckIn.Status.PENDING,
            )
            .select_related("goal")
        )

        reminder_goals = []

        for checkin in checkins:
            reminder_goals.append(
                {
                    "checkin_id": checkin.id,
                    "goal": checkin.goal.title,
                    "description": checkin.goal.description,
                    "status": checkin.status,
                    "date": str(checkin.date),
                }
            )

        return {
            "pending_count": len(reminder_goals),
            "goals": reminder_goals,
        }