from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class Goal(models.Model):
    """
    A recurring habit/objective a user is tracking.

    Deliberately lightweight: recurrence rules live on GoalSchedule,
    and completion history will live on Check-ins (a future module).
    Keeping Goal itself simple means it stays stable while those
    other concerns evolve independently.
    """

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        ARCHIVED = "archived", "Archived"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.ACTIVE
    )
    # Open-ended bucket for future integrations (e.g. a source app id,
    # channel-specific config) without requiring a schema migration.
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            # Named explicitly rather than relying on Django's
            # auto-generated hash name, so it stays stable and
            # readable in the DB across migration history.
            models.Index(fields=["user", "status"], name="goal_user_status_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.user_id})"


class GoalSchedule(models.Model):
    """
    Recurrence configuration for a Goal.

    Kept separate from Goal rather than as columns on it, because
    scheduling is read by different future consumers than the goal's
    identity fields -- Notifications will read this to decide when
    to remind, Analytics will read it to know the expected check-in
    cadence. Both should be able to evolve without touching Goal.
    """

    class Frequency(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        CUSTOM = "custom", "Custom"

    goal = models.OneToOneField(
        Goal,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="schedule",
    )
    frequency = models.CharField(max_length=10, choices=Frequency.choices)
    # Days this goal recurs on, using Python's date.weekday() convention:
    # Monday=0 ... Sunday=6. Relevant for WEEKLY (and optionally CUSTOM);
    # ignored otherwise.
    days_of_week = models.JSONField(default=list, blank=True)
    # Day of month (1-31) this goal recurs on. Relevant for MONTHLY only.
    day_of_month = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(31)],
    )
    # Supports "every N days/weeks/months" cadences without a schema
    # change later (e.g. frequency=WEEKLY, interval=2 -> every 2 weeks).
    interval = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1)]
    )
    start_date = models.DateField(default=timezone.localdate)
    end_date = models.DateField(null=True, blank=True)
    # Open-ended rule payload for CUSTOM frequency. Deliberately left
    # unstructured: no scheduler exists yet to interpret it, so we
    # avoid guessing its shape ahead of that actual need.
    custom_rule = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "goal schedule"
        verbose_name_plural = "goal schedules"

    def __str__(self) -> str:
        return f"Schedule<{self.goal_id}:{self.frequency}>"