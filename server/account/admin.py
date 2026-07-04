from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Profile, User, UserPreferences


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"


class UserPreferencesInline(admin.StackedInline):
    model = UserPreferences
    can_delete = False
    verbose_name_plural = "Preferences"


class CustomUserAdmin(UserAdmin):
    """
    Extends the stock UserAdmin (list view, search, password change,
    permission management, etc. all preserved as-is) to also surface
    Profile and Preferences inline on the same user edit page.
    """

    inlines = (ProfileInline, UserPreferencesInline)


admin.site.register(User, CustomUserAdmin)