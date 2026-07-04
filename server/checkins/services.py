from __future__ import annotations

from datetime import date

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import CheckIn


@transaction.atomic
def create_checkin(
    *,
    goal,
    date: date,
) -> CheckIn:
    """
    Create a daily check-in for a goal.

    A goal can have only one check-in per day.
    """

    checkin, _ = CheckIn.objects.get_or_create(
        goal=goal,
        date=date,
    )

    return checkin


@transaction.atomic
def complete_checkin(
    checkin: CheckIn,
    *,
    notes: str = "",
) -> CheckIn:
    """
    Mark a check-in as completed.
    """

    if checkin.status != CheckIn.Status.PENDING:
        raise ValidationError(
            "Only pending check-ins can be completed."
        )

    checkin.status = CheckIn.Status.COMPLETED
    checkin.notes = notes
    checkin.save(
        update_fields=[
            "status",
            "notes",
            "updated_at",
        ]
    )

    return checkin


@transaction.atomic
def miss_checkin(
    checkin: CheckIn,
    *,
    notes: str = "",
) -> CheckIn:
    """
    Mark a check-in as missed.
    """

    if checkin.status != CheckIn.Status.PENDING:
        raise ValidationError(
            "Only pending check-ins can be marked as missed."
        )

    checkin.status = CheckIn.Status.MISSED
    checkin.notes = notes
    checkin.save(
        update_fields=[
            "status",
            "notes",
            "updated_at",
        ]
    )

    return checkin


@transaction.atomic
def skip_checkin(
    checkin: CheckIn,
    *,
    notes: str = "",
) -> CheckIn:
    """
    Mark a check-in as skipped.
    """

    if checkin.status != CheckIn.Status.PENDING:
        raise ValidationError(
            "Only pending check-ins can be skipped."
        )

    checkin.status = CheckIn.Status.SKIPPED
    checkin.notes = notes
    checkin.save(
        update_fields=[
            "status",
            "notes",
            "updated_at",
        ]
    )

    return checkin


def delete_checkin(checkin: CheckIn) -> None:
    """
    Hard delete.

    Safe until analytics/history depends on check-ins.
    """

    checkin.delete()