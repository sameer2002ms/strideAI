from rest_framework.permissions import BasePermission


class IsConversationOwner(BasePermission):
    """
    Object-level permission restricting access to the conversation owner.

    Querysets are already scoped through selectors, so this acts as
    defense in depth. If a future change accidentally exposes a
    conversation outside its owner scope, DRF will still deny access.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id