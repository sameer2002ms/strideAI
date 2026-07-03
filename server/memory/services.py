from django.db import transaction

from .models import UserMemory


class MemoryService:
    """
    Handles all write operations for user memory.
    """

    @staticmethod
    @transaction.atomic
    def set_memory(
        *,
        user,
        key: str,
        value: str,
        source: str = UserMemory.Source.USER,
        confidence: float = 1.0,
    ) -> UserMemory:
        """
        Create or update a memory for a user.
        """

        memory, _ = UserMemory.objects.update_or_create(
            user=user,
            key=key,
            defaults={
                "value": value,
                "source": source,
                "confidence": confidence,
            },
        )

        return memory

    @staticmethod
    @transaction.atomic
    def delete_memory(*, user, key: str) -> None:
        """
        Delete a memory by key.
        """

        UserMemory.objects.filter(
            user=user,
            key=key,
        ).delete()

    @staticmethod
    @transaction.atomic
    def clear_memories(*, user) -> None:
        """
        Remove all memories belonging to a user.
        """

        UserMemory.objects.filter(user=user).delete()