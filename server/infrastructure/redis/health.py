from __future__ import annotations

import time

from infrastructure.redis.client import redis_client


class RedisHealthCheck:
    """
    Health checker for Redis.

    Responsibilities:
    - Verify Redis connectivity.
    - Measure ping latency.
    - Return structured health information.
    """

    def check(self) -> dict:
        start = time.perf_counter()

        try:
            redis_client.ping()

            latency_ms = round((time.perf_counter() - start) * 1000, 2)

            return {
                "healthy": True,
                "latency_ms": latency_ms,
                "message": "Redis connection successful",
            }

        except Exception as exc:
            return {
                "healthy": False,
                "latency_ms": None,
                "message": str(exc),
            }


redis_health = RedisHealthCheck()