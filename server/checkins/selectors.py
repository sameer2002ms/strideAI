from __future__ import annotations

from datetime import date

from django.http import Http404

from .models import CheckIn


def get_goal_checkins(goal):
    return CheckIn.objects.filter(goal=goal)


def get_goal_checkin_for_date(goal, *, date_: date):
    return (
        CheckIn.objects
        .filter(goal=goal, date=date_)
        .first()
    )


def get_user_checkin_or_404(user, checkin_id):
    try:
        return (
            CheckIn.objects
            .select_related("goal")
            .get(goal__user=user, pk=checkin_id)
        )
    except CheckIn.DoesNotExist:
        raise Http404("Check-in not found.")


def get_user_checkins(user):
    return (
        CheckIn.objects
        .filter(goal__user=user)
        .select_related("goal")
    )


def get_pending_checkins_for_date(*, user, date_: date):
    return (
        CheckIn.objects
        .filter(
            goal__user=user,
            date=date_,
            status=CheckIn.Status.PENDING,
        )
        .select_related("goal")
    )