from datetime import date

from checkins.selectors import get_pending_checkins_for_date
from checkins.services import complete_checkin, miss_checkin, skip_checkin

from ai.reasoning import ReasoningService
from ai.prompts.builder import PromptBuilder
from ai.builder import ContextBuilder
from ai.accountability.intent_detector import IntentDetector
from ai.accountability.intent import IntentType
from ai.accountability.behavior_engine import BehaviorEngine

class AccountabilityEngine:
    """
    Adds behavior layer on top of AI.
    """

    def __init__(self) -> None:
        self.reasoning = ReasoningService()

    def process(self, *, conversation, message: str):

        # 1. Detect intent
        intent = IntentDetector.detect(message)

        # 2. Load context
        context = ContextBuilder.build(conversation=conversation)

        # 3. Inject latest message
        context.memory.facts["latest_user_message"] = message

        # 3.5 Inject behavior (IMPORTANT)
        behavior_instruction = BehaviorEngine.build_instructions(intent)
        context.memory.facts["behavior_instruction"] = behavior_instruction

        # 4. Get today's check-ins
        today = date.today()

        pending_checkins = get_pending_checkins_for_date(
            user=conversation.user,
            date_=today,
        )

        # 5. System action layer (CORE BEHAVIOR)
        if pending_checkins:
            checkin = pending_checkins[0]

            if intent == IntentType.COMPLETE:
                complete_checkin(checkin)

            elif intent == IntentType.MISS:
                miss_checkin(checkin)

            elif intent == IntentType.SKIP:
                skip_checkin(checkin)

        # 6. Build prompt
        prompt = PromptBuilder.build(context=context)

        # 7. Generate AI response
        response = self.reasoning.generate(prompt=prompt)

        return response