from django.contrib import admin

from .models import CheckIn


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = (
        "goal",
        "date",
        "status",
    )

    list_filter = (
        "status",
        "date",
    )

    search_fields = (
        "goal__title",
        "goal__user__email",
    )