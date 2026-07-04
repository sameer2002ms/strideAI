"""
Write-side business logic for the account app.

Views and serializers delegate mutations here. Today this is thin
CRUD, but keeping the boundary in place from module 1 onward means
every future module in this project follows the same shape.
"""

from django.db import transaction

from .models import Profile, UserPreferences
from .selectors import get_or_create_preferences, get_or_create_profile


@transaction.atomic
def update_profile(user, **fields) -> Profile:
    """
    Update the given fields on the user's profile and persist.
    Unknown/unsupported fields are the caller's responsibility to
    have already filtered out (the serializer does this via validation).
    """
    profile = get_or_create_profile(user)
    for field, value in fields.items():
        setattr(profile, field, value)
    profile.save()
    return profile


@transaction.atomic
def update_preferences(user, **fields) -> UserPreferences:
    """
    Update the given fields on the user's preferences and persist.
    """
    preferences = get_or_create_preferences(user)
    for field, value in fields.items():
        setattr(preferences, field, value)
    preferences.save()
    return preferences
