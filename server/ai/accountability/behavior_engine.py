from ai.accountability.intent import IntentType


class BehaviorEngine:
    """
    Controls how StrideAI responds emotionally + strategically
    based on user behavior.
    """

    @staticmethod
    def build_instructions(intent: IntentType, checkin_status: str | None = None) -> str:
        """
        Returns system-level coaching instructions.
        """

        if intent == IntentType.COMPLETE:
            return (
                "User has completed a task. "
                "Respond with reinforcement, praise, and momentum building."
            )

        if intent == IntentType.MISS:
            return (
                "User missed a task. "
                "Be firm but supportive. Focus on recovery, not guilt."
            )

        if intent == IntentType.SKIP:
            return (
                "User skipped a task. "
                "Explore reasoning and gently push for commitment."
            )

        if intent == IntentType.NEGATIVE:
            return (
                "User is demotivated or tired. "
                "Be empathetic and reduce pressure while keeping consistency goal."
            )

        return (
            "User is neutral. "
            "Act as a productivity accountability coach."
        )