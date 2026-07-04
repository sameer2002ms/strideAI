from .models import UserMemory


class MemorySelector:
    """
    Handles all read operations for user memory.
    """

    @staticmethod
    def get_memory(*, user, key: str):
        return (
            UserMemory.objects.filter(
                user=user,
                key=key,
            )
            .first()
        )

    @staticmethod
    def list_memories(*, user):
        return UserMemory.objects.filter(user=user)

    @staticmethod
    def memory_exists(*, user, key: str) -> bool:
        return UserMemory.objects.filter(
            user=user,
            key=key,
        ).exists()

    @staticmethod
    def memory_dict(*, user) -> dict[str, str]:
        """
        Returns user memories as:

        {
            "timezone": "Asia/Kolkata",
            "study_time": "Night"
        }
        """

        return {
            memory.key: memory.value
            for memory in UserMemory.objects.filter(user=user)
        }