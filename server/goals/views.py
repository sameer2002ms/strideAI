from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissons import IsGoalOwner
from .selectors import get_user_goal_or_404, get_user_goals
from .serializers import GoalSerializer
from .services import archive_goal, pause_goal, resume_goal, delete_goal


class GoalListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  -> List current user's goals
    POST -> Create a new goal
    """

    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        status_filter = self.request.query_params.get("status")
        return get_user_goals(self.request.user, status=status_filter)

    def perform_create(self, serializer):
        serializer.save()


class GoalRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET
    PATCH
    DELETE
    """

    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated, IsGoalOwner]

    def get_object(self):
        goal = get_user_goal_or_404(
            self.request.user,
            self.kwargs["pk"],
        )
        self.check_object_permissions(self.request, goal)
        return goal

    def perform_destroy(self, instance):
        delete_goal(instance)


class PauseGoalAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        goal = get_user_goal_or_404(request.user, pk)
        pause_goal(goal)
        return Response(
            GoalSerializer(goal).data,
            status=status.HTTP_200_OK,
        )


class ResumeGoalAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        goal = get_user_goal_or_404(request.user, pk)
        resume_goal(goal)
        return Response(
            GoalSerializer(goal).data,
            status=status.HTTP_200_OK,
        )


class ArchiveGoalAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        goal = get_user_goal_or_404(request.user, pk)
        archive_goal(goal)
        return Response(
            GoalSerializer(goal).data,
            status=status.HTTP_200_OK,
        )