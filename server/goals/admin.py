from django.contrib import admin

from .models import Goal, GoalSchedule


class GoalScheduleInline(admin.StackedInline):
    model = GoalSchedule
    can_delete = False
    extra = 0


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user",
        "status",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "user__email",
        "user__username",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "user",
    )

    inlines = [GoalScheduleInline]

    ordering = ("-created_at",)


@admin.register(GoalSchedule)
class GoalScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "goal",
        "frequency",
        "interval",
        "start_date",
        "end_date",
    )

    list_filter = (
        "frequency",
    )

    search_fields = (
        "goal__title",
        "goal__user__email",
        "goal__user__username",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )