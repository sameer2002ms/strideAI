from django.urls import path

from .views import (
    CheckInListCreateAPIView,
    CheckInRetrieveDestroyAPIView,
    CompleteCheckInAPIView,
    MissCheckInAPIView,
    SkipCheckInAPIView,
)

app_name = "checkins"

urlpatterns = [
    path(
        "",
        CheckInListCreateAPIView.as_view(),
        name="checkin-list-create",
    ),
    path(
        "<int:pk>/",
        CheckInRetrieveDestroyAPIView.as_view(),
        name="checkin-detail",
    ),
    path(
        "<int:pk>/complete/",
        CompleteCheckInAPIView.as_view(),
        name="checkin-complete",
    ),
    path(
        "<int:pk>/miss/",
        MissCheckInAPIView.as_view(),
        name="checkin-miss",
    ),
    path(
        "<int:pk>/skip/",
        SkipCheckInAPIView.as_view(),
        name="checkin-skip",
    ),
]