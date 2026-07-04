from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    """
    Custom user model for ChatWithDoc.

    Extends Django's AbstractUser so we can
    add application-specific fields in the future.
    """

    pass


class Profile(models.Model):
    """
    Identity / biographical information about a user.

    Kept separate from `User` on purpose: authentication-critical
    fields (password, permissions, username) should never share a
    table with data that changes independently of identity. That
    keeps migrations touching AUTH_USER_MODEL rare and low-risk.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="profile",
    )
    bio = models.TextField(blank=True, default="")
    # Stored as a URL (not ImageField) since no media/object storage is
    # configured yet. This keeps the schema stable regardless of where
    # avatars end up being hosted (e.g. Supabase Storage) later.
    avatar_url = models.URLField(blank=True, default="")
    phone_number = models.CharField(max_length=32, blank=True, default="")
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "profile"
        verbose_name_plural = "profiles"

    def __str__(self) -> str:
        return f"Profile<{self.user_id}>"


class UserPreferences(models.Model):
    """
    Behavioral / UX settings for a user.

    Deliberately separate from `Profile`: preferences change more
    often and will be read by future modules (Goals need timezone
    for correct daily/weekly boundaries, Analytics needs it for
    streak calculations). Evolving preferences should never require
    touching identity data.
    """

    class Theme(models.TextChoices):
        LIGHT = "light", "Light"
        DARK = "dark", "Dark"
        SYSTEM = "system", "System"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="preferences",
    )
    timezone = models.CharField(max_length=64, default="UTC")
    language = models.CharField(max_length=10, default="en")
    theme = models.CharField(
        max_length=10, choices=Theme.choices, default=Theme.SYSTEM
    )
    # Open-ended, forward-compatible bucket for future UX toggles that
    # don't yet warrant their own column. Deliberately NOT used for
    # reminder/notification config -- that belongs to the future
    # `notifications` app, to avoid two modules owning the same data.
    extra_settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "user preferences"
        verbose_name_plural = "user preferences"

    def __str__(self) -> str:
        return f"Preferences<{self.user_id}>"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile_and_preferences(sender, instance, created, **kwargs):
    """
    Auto-provision a Profile and UserPreferences row whenever a User
    is created, regardless of the creation path (register API, Django
    admin, `createsuperuser`, future auth flows).

    Uses get_or_create (not create) so it stays safe to run more than
    once and self-heals for any user created before this signal existed.
    """
    if created:
        Profile.objects.get_or_create(user=instance)
        UserPreferences.objects.get_or_create(user=instance)