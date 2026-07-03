from django.db import models

from goals.models import Goal


class CheckIn(models.Model):
    """
    Represents the outcome of a goal for a specific day.

    Check-ins are the foundation of StrideAI's accountability engine.
    They record whether the user completed, missed, skipped, or has
    not yet reported progress for a scheduled occurrence of a goal.
    """

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        MISSED = "missed", "Missed"
        SKIPPED = "skipped", "Skipped"

    goal = models.ForeignKey(
        Goal,
        on_delete=models.CASCADE,
        related_name="checkins",
    )

    date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    notes = models.TextField(
        blank=True,
        default="",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-date"]
        constraints = [
            models.UniqueConstraint(
                fields=["goal", "date"],
                name="unique_goal_checkin_per_day",
            ),
        ]
        indexes = [
            models.Index(
                fields=["goal", "date"],
                name="checkin_goal_date_idx",
            ),
        ]


    def __str__(self):
        return f"{self.goal.title} - {self.date} ({self.status})"