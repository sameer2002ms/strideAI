from dataclasses import dataclass
from typing import List


@dataclass
class BehaviorDecision:
    type: str   # "reminder", "motivation", "warning"
    message: str


class BehaviorEngine:
    """
    Decides HOW to respond to user state.
    """

    @staticmethod
    def analyze(*, user, pending_checkins: List[dict]) -> BehaviorDecision:
        count = len(pending_checkins)

        # Case 1: No pending work
        if count == 0:
            return BehaviorDecision(
                type="none",
                message=""
            )

        # Case 2: Light reminder
        if count == 1:
            return BehaviorDecision(
                type="reminder",
                message="You have 1 pending goal today. Let’s complete it."
            )

        # Case 3: Medium load
        if count <= 3:
            return BehaviorDecision(
                type="motivation",
                message=f"You have {count} pending goals. Let’s start with one small step."
            )

        # Case 4: Heavy backlog
        return BehaviorDecision(
            type="warning",
            message=(
                f"You have {count} pending tasks. "
                "Let’s focus on just ONE today to restart momentum."
            )
        )