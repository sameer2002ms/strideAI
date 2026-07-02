from django.conf import settings
from django.db import models


class Conversation(models.Model):
    """
    Represents a single interaction session between a user and StrideAI.

    A conversation is channel-agnostic. Whether it originates from
    Telegram, the web application, WhatsApp, or a future voice call,
    they are all represented by the same model.
    """

    class Channel(models.TextChoices):
        WEB = "web", "Web"
        TELEGRAM = "telegram", "Telegram"
        VOICE = "voice", "Voice"
        WHATSAPP = "whatsapp", "WhatsApp"
        SYSTEM = "system", "System"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ABANDONED = "abandoned", "Abandoned"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations",
    )

    channel = models.CharField(
        max_length=20,
        choices=Channel.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    started_at = models.DateTimeField(auto_now_add=True)

    ended_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(
                fields=["user", "status"],
                name="conversation_user_status_idx",
            ),
        ]

    def __str__(self):
        return (
            f"Conversation<{self.pk}> "
            f"[{self.channel}] "
            f"{self.status}"
        )


class Message(models.Model):
    """
    Represents a single message exchanged within a conversation.

    Messages are intentionally lightweight. AI-specific concepts such
    as embeddings, token usage, tool calls, and structured outputs
    belong in future modules.
    """

    class Sender(models.TextChoices):
        USER = "user", "User"
        ASSISTANT = "assistant", "Assistant"
        SYSTEM = "system", "System"

    class MessageType(models.TextChoices):
        TEXT = "text", "Text"
        EVENT = "event", "Event"

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.CharField(
        max_length=20,
        choices=Sender.choices,
    )

    message_type = models.CharField(
        max_length=20,
        choices=MessageType.choices,
        default=MessageType.TEXT,
    )

    content = models.TextField()

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(
                fields=["conversation", "created_at"],
                name="message_conv_created_idx",
            ),
        ]

    def __str__(self):
        return (
            f"{self.sender} "
            f"({self.message_type}) "
            f"- Conversation {self.conversation_id}"
        )
        
        
class Purpose(models.TextChoices):
    ACCOUNTABILITY = "accountability", "Accountability"
    STUDY = "study", "Study"
    FITNESS = "fitness", "Fitness"
    CAREER = "career", "Career"
    SYSTEM = "system", "System"

purpose = models.CharField(
    max_length=30,
    choices=Purpose.choices,
    default=Purpose.ACCOUNTABILITY,
)        