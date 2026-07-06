from datetime import date

from checkins.selectors import get_pending_checkins_for_date


class ReminderEngine:
    """
    Builds reminder payloads for users.
    """

    @staticmethod
    def get_pending_checkins(*, user):
        return get_pending_checkins_for_date(
            user=user,
            date_=date.today(),
        )

    @staticmethod
    def build_payload(*, user):
        checkins = ReminderEngine.get_pending_checkins(
            user=user,
        )

        return [
            {
                "checkin_id": checkin.id,
                "goal": checkin.goal.title,
            }
            for checkin in checkins
        ]