from ai.accountability.engine import AccountabilityEngine
from ai.schemas import ReasoningResponse


class AgentEngine:
    def __init__(self) -> None:
        self.accountability = AccountabilityEngine()

    def process_message(self, *, conversation, message: str):
        return self.accountability.process(
            conversation=conversation,
            message=message,
        )