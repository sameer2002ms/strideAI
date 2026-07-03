from rest_framework.permissions import BasePermission


class IsCheckInOwner(BasePermission):
    """
    Ensures users can only access their own check-ins.
    """

    def has_object_permission(self, request, view, obj):
        return obj.goal.user == request.user