"""
Read-side accessors for the goals app.

Every function here is scoped to a specific user. There is no
selector that returns a goal without an owner filter -- that's the
primary defense against cross-user access, independent of whatever
permission checks also run at the view layer.
"""

from __future__ import annotations

from django.http import Http404

from .models import Goal


def get_user_goals(user, status: str | None = None):
    """
    Return the requesting user's own goals, optionally filtered by
    status (e.g. ?status=active).
    """
    queryset = Goal.objects.filter(user=user).select_related("schedule")
    if status:
        queryset = queryset.filter(status=status)
    return queryset


def get_user_goal_or_404(user, goal_id) -> Goal:
    """
    Fetch a single goal, scoped to the requesting user.

    A goal that exists but belongs to someone else raises Http404,
    the same as one that doesn't exist at all -- this avoids leaking
    whether a given id belongs to another user.
    """
    try:
        return Goal.objects.select_related("schedule").get(user=user, pk=goal_id)
    except Goal.DoesNotExist:
        raise Http404("Goal not found.")
    
    
    
from django.utils import timezone


def get_goals_due_for_reminder():
    """
    Return goals whose reminder time is due right now.
    """

    now = timezone.localtime().replace(second=0, microsecond=0).time()

    return (
        Goal.objects
        .filter(
            status=Goal.Status.ACTIVE,
            schedule__reminder_enabled=True,
            schedule__reminder_time=now,
        )
        .select_related(
            "user",
            "schedule",
        )
    )