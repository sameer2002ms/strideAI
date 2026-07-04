from django.urls import path

from .views import (
    AbandonConversationAPIView,
    ConversationListCreateAPIView,
    ConversationMessagesAPIView,
    ConversationRetrieveDestroyAPIView,
    EndConversationAPIView,
)

app_name = "conversations"

urlpatterns = [
    path(
        "",
        ConversationListCreateAPIView.as_view(),
        name="conversation-list-create",
    ),
    path(
        "<int:pk>/",
        ConversationRetrieveDestroyAPIView.as_view(),
        name="conversation-detail",
    ),
    path(
        "<int:pk>/messages/",
        ConversationMessagesAPIView.as_view(),
        name="conversation-messages",
    ),
    path(
        "<int:pk>/end/",
        EndConversationAPIView.as_view(),
        name="conversation-end",
    ),
    path(
        "<int:pk>/abandon/",
        AbandonConversationAPIView.as_view(),
        name="conversation-abandon",
    ),
]