"""
Read-side accessors for the account app.

Selectors never mutate state. They exist so views/serializers don't
query models directly, keeping a single place to change how data is
fetched (e.g. adding select_related later) without touching callers.
"""

from .models import Profile, UserPreferences


def get_or_create_profile(user) -> Profile:
    """
    Return the user's Profile, creating a default one if it doesn't
    exist yet. The post_save signal on User covers new users; this
    covers users that existed before Profile did.
    """
    profile, _ = Profile.objects.get_or_create(user=user)
    return profile


def get_or_create_preferences(user) -> UserPreferences:
    """
    Return the user's UserPreferences, creating defaults if needed.
    """
    preferences, _ = UserPreferences.objects.get_or_create(user=user)
    return preferences
