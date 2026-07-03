from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsCheckInOwner
from .selectors import (
    get_user_checkin_or_404,
    get_user_checkins,
)
from .serializers import CheckInSerializer
from .services import (
    complete_checkin,
    miss_checkin,
    skip_checkin,
    delete_checkin,
)


class CheckInListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CheckInSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_user_checkins(self.request.user)

    def perform_create(self, serializer):
        serializer.save()
        
class CheckInRetrieveDestroyAPIView(
    generics.RetrieveDestroyAPIView
):
    serializer_class = CheckInSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsCheckInOwner,
    ]

    def get_object(self):
        checkin = get_user_checkin_or_404(
            self.request.user,
            self.kwargs["pk"],
        )

        self.check_object_permissions(
            self.request,
            checkin,
        )

        return checkin

    def perform_destroy(self, instance):
        delete_checkin(instance)
        
        
class CompleteCheckInAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        checkin = get_user_checkin_or_404(
            request.user,
            pk,
        )

        self.check_object_permissions(
            request,
            checkin,
        )

        complete_checkin(checkin)

        return Response(
            CheckInSerializer(checkin).data,
            status=status.HTTP_200_OK,
        )
        
class MissCheckInAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        checkin = get_user_checkin_or_404(
            request.user,
            pk,
        )

        self.check_object_permissions(
            request,
            checkin,
        )

        miss_checkin(checkin)

        return Response(
            CheckInSerializer(checkin).data,
            status=status.HTTP_200_OK,
        )
        
class SkipCheckInAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        checkin = get_user_checkin_or_404(
            request.user,
            pk,
        )

        self.check_object_permissions(
            request,
            checkin,
        )

        skip_checkin(checkin)

        return Response(
            CheckInSerializer(checkin).data,
            status=status.HTTP_200_OK,
        )                