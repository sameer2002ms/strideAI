from django.contrib import admin

from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = (
        "created_at",
    )


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "channel",
        "status",
        "started_at",
        "ended_at",
    )

    list_filter = (
        "channel",
        "status",
    )

    search_fields = (
        "user__email",
        "user__username",
    )

    readonly_fields = (
        "started_at",
        "ended_at",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "user",
    )

    ordering = (
        "-started_at",
    )

    inlines = [
        MessageInline,
    ]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "conversation",
        "sender",
        "message_type",
        "created_at",
    )

    list_filter = (
        "sender",
        "message_type",
    )

    search_fields = (
        "content",
        "conversation__user__email",
        "conversation__user__username",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = (
        "created_at",
    )