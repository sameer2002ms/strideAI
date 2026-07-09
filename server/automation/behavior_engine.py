from dataclasses import dataclass


@dataclass
class BehaviorDecision:
    type: str
    message: str


class BehaviorEngine:
    """
    Decides HOW to respond based on reminder context.
    """

    @staticmethod
    def analyze(*, user, pending_checkins: dict) -> BehaviorDecision:

        goals = pending_checkins.get("goals", [])
        count = pending_checkins.get("pending_count", 0)

        if count == 0:
            return BehaviorDecision(
                type="none",
                message="",
            )

        # Single goal
        if count == 1:
            goal = goals[0]

            message = (
                f"👋 Hi {user.first_name or user.username},\n\n"
                f"Today's goal:\n"
                f"🎯 {goal['goal']}\n"
            )

            if goal["description"]:
                message += f"{goal['description']}\n\n"

            message += "Let's complete it today 💪"

            return BehaviorDecision(
                type="reminder",
                message=message,
            )

        # Multiple goals
        goal_list = "\n".join(
            f"• {goal['goal']}"
            for goal in goals
        )

        return BehaviorDecision(
            type="motivation",
            message=(
                f"👋 Hi {user.first_name or user.username},\n\n"
                f"You still have {count} goals today:\n\n"
                f"{goal_list}\n\n"
                "Which one will you finish first? 🚀"
            ),
        )