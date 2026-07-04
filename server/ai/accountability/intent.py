# ai/accountability/intents.py

from enum import Enum


class IntentType(str, Enum):
    COMPLETE = "complete"
    MISS = "miss"
    SKIP = "skip"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    UNKNOWN = "unknown"