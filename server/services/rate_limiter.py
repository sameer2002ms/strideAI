from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import math
import time
from django.conf import settings

from infrastructure.redis.client import redis_client


@dataclass(slots=True, frozen=True)
class RateLimitResult:
    allowed: bool
    limit: int
    current_count: int
    remaining: int
    reset_at: int
    retry_after: int | None = None


class RateLimiterService:
    """
    Redis Fixed Window Rate Limiter
    """


    def __init__(
        self,
        limit: int | None = None,
        window_seconds: int | None = None,
    ) -> None:

        self.limit = limit or settings.RATE_LIMIT
        self.window_seconds = (
            window_seconds or settings.RATE_LIMIT_WINDOW
        )

        self.client = redis_client.get_client()
            
        
        
    def _current_window(self) -> int:
        """
        Returns the current window number.
        Example:
            1751234567 // 60 = 29187242
        """
        return math.floor(time.time() / self.window_seconds)
    

    def _build_key(self, identifier: str) -> str:
        """
        Build Redis key.

        Example:
        rate_limit:ip:192.168.1.10:29187242
        """
        return f"rate_limit:{identifier}:{self._current_window()}"
    
    def is_allowed(self, identifier: str) -> RateLimitResult:
        """
        Check whether the identifier has exceeded
        the configured rate limit.
        """

        key = self._build_key(identifier)

        current_count = self.client.incr(key)

        if current_count == 1:
            self.client.expire(key, self.window_seconds)

        remaining = max(self.limit - current_count, 0)

        ttl = max(self.client.ttl(key), 0)

        reset_at = int(time.time()) + ttl

        allowed = current_count <= self.limit

        retry_after = None if allowed else ttl

        return RateLimitResult(
            allowed=allowed,
            limit=self.limit,
            current_count=current_count,
            remaining=remaining,
            reset_at=reset_at,
            retry_after=retry_after,
        )