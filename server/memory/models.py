from django.conf import settings
from django.db import models


class UserMemory(models.Model):
    """
    Stores long-term user facts that can be used by AI agents
    to personalize responses and decision making.

    Memory is independent from conversations and goals.
    """

    class Source(models.TextChoices):
        USER = "user", "User"
        AI = "ai", "AI"
        SYSTEM = "system", "System"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memories",
    )

    key = models.CharField(
        max_length=100,
    )

    value = models.TextField()

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.USER,
    )

    confidence = models.FloatField(
        default=1.0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["key"]
        unique_together = ("user", "key")
        indexes = [
            models.Index(fields=["user", "key"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.key}"