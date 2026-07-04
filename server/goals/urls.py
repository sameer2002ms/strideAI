from django.urls import path

from .views import (
    ArchiveGoalAPIView,
    GoalListCreateAPIView,
    GoalRetrieveUpdateDestroyAPIView,
    PauseGoalAPIView,
    ResumeGoalAPIView,
)

app_name = "goals"

urlpatterns = [
    path(
        "",
        GoalListCreateAPIView.as_view(),
        name="goal-list-create",
    ),
    path(
        "<int:pk>/",
        GoalRetrieveUpdateDestroyAPIView.as_view(),
        name="goal-detail",
    ),
    path(
        "<int:pk>/pause/",
        PauseGoalAPIView.as_view(),
        name="goal-pause",
    ),
    path(
        "<int:pk>/resume/",
        ResumeGoalAPIView.as_view(),
        name="goal-resume",
    ),
    path(
        "<int:pk>/archive/",
        ArchiveGoalAPIView.as_view(),
        name="goal-archive",
    ),
]