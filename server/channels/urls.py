from django.urls import path

from channels.views import create_telegram_link, telegram_webhook

urlpatterns = [
    path(
        "telegram/webhook/",
        telegram_webhook,
        name="telegram-webhook",
    ),
    path("telegram/link/", create_telegram_link, name="telegram-link"),
]