# ai/accountability/intent_detector.py

from .intent import IntentType


class IntentDetector:
    """
    Lightweight rule-based intent detection for accountability actions.
    """

    @staticmethod
    def detect(message: str) -> IntentType:
        text = message.lower()

        # completion signals
        if any(word in text for word in ["done", "completed", "finished", "did it"]):
            return IntentType.COMPLETE

        # skip signals
        if any(word in text for word in ["skip", "not today", "tomorrow"]):
            return IntentType.SKIP

        # miss signals
        if any(word in text for word in ["didn't", "couldn't", "missed"]):
            return IntentType.MISS

        # negative state (important for coaching tone)
        if any(word in text for word in ["tired", "lazy", "no motivation"]):
            return IntentType.NEGATIVE

        return IntentType.NEUTRAL