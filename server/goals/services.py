"""
Write-side business logic for the goals app.

Views and serializers delegate mutations here. Unlike the account
app's services (mostly plain CRUD), these enforce real state-machine
rules -- a goal cannot exist without a schedule, and status can only
move through valid transitions.
"""

from __future__ import annotations

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import Goal, GoalSchedule


@transaction.atomic
def create_goal(user, *, title, description="", metadata=None, schedule_data) -> Goal:
    """
    Create a Goal together with its GoalSchedule as a single atomic
    operation. A Goal without a schedule is a state the system should
    never allow to exist, even momentarily.
    """
    goal = Goal.objects.create(
        user=user,
        title=title,
        description=description,
        metadata=metadata or {},
    )
    GoalSchedule.objects.create(goal=goal, **schedule_data)
    return goal


@transaction.atomic
def update_goal(goal: Goal, *, schedule_data=None, **fields) -> Goal:
    """
    Update a goal's editable fields and, optionally, its schedule.

    Archived goals are read-only: allowing edits after archiving
    would let a goal keep changing after the user has signalled
    they're done with it.
    """
    if goal.status == Goal.Status.ARCHIVED:
        raise ValidationError("Archived goals cannot be modified.")

    for field, value in fields.items():
        setattr(goal, field, value)
    goal.save()

    if schedule_data:
        schedule = goal.schedule
        for field, value in schedule_data.items():
            setattr(schedule, field, value)
        schedule.save()

    return goal


def pause_goal(goal: Goal) -> Goal:
    if goal.status != Goal.Status.ACTIVE:
        raise ValidationError("Only active goals can be paused.")
    goal.status = Goal.Status.PAUSED
    goal.save(update_fields=["status", "updated_at"])
    return goal


def resume_goal(goal: Goal) -> Goal:
    if goal.status != Goal.Status.PAUSED:
        raise ValidationError("Only paused goals can be resumed.")
    goal.status = Goal.Status.ACTIVE
    goal.save(update_fields=["status", "updated_at"])
    return goal


def archive_goal(goal: Goal) -> Goal:
    if goal.status == Goal.Status.ARCHIVED:
        raise ValidationError("Goal is already archived.")
    goal.status = Goal.Status.ARCHIVED
    goal.save(update_fields=["status", "updated_at"])
    return goal


def delete_goal(goal: Goal) -> None:
    """
    Hard delete. No dependents exist yet (Check-ins doesn't exist
    until Module 3), so there's no cascade/orphan concern today.
    Revisit this once Check-ins references Goal via FK -- deleting a
    goal with accountability history attached may need to be
    restricted or changed to a soft delete at that point.
    """
    goal.delete()