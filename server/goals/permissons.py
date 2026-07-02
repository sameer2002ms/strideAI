from rest_framework.permissions import BasePermission


class IsGoalOwner(BasePermission):
    """
    Object-level permission restricting access to the goal's owner.

    This is defense in depth, not the primary guard: selectors
    already scope querysets to request.user, so a wrong id 404s
    before this ever runs. This exists as cheap insurance against a
    future selector regression, since DRF's generic retrieve/update/
    destroy views call has_object_permission on every object access.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id