from django.conf import settings
from django.db import models
import secrets
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

class ChannelType(models.TextChoices):
    TELEGRAM = "telegram", "Telegram"
    WHATSAPP = "whatsapp", "WhatsApp"
    DISCORD = "discord", "Discord"
    WEB = "web", "Web"
    VOICE = "voice", "Voice"
    PHONE = "phone", "Phone"


class ChannelAccount(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="channel_accounts",
    )

    channel = models.CharField(
        max_length=20,
        choices=ChannelType.choices,
    )

    external_user_id = models.CharField(
        max_length=255,
    )

    chat_id = models.CharField(
        max_length=255,
    )

    username = models.CharField(
        max_length=255,
        blank=True,
    )

    first_name = models.CharField(
        max_length=255,
        blank=True,
    )

    last_name = models.CharField(
        max_length=255,
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (
            "channel",
            "external_user_id",
        )

        indexes = [
            models.Index(
                fields=["channel", "external_user_id"],
            ),
            models.Index(
                fields=["user"],
            ),
        ]

    def __str__(self):
        return f"{self.user} ({self.channel})"
    
    
    



class ChannelLinkToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="channel_link_tokens",
    )

    channel = models.CharField(
        max_length=20,
        choices=ChannelType.choices,
    )

    token = models.CharField(
        max_length=64,
        unique=True,
    )

    is_used = models.BooleanField(default=False)

    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    @staticmethod
    def generate_token():
        return secrets.token_urlsafe(16)

    @staticmethod
    def create_for_user(user, channel="telegram", minutes=10):
        return ChannelLinkToken.objects.create(
            user=user,
            channel=channel,
            token=ChannelLinkToken.generate_token(),
            expires_at=timezone.now() + timedelta(minutes=minutes),
        )