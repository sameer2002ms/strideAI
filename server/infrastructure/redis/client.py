from __future__ import annotations

import redis
from django.conf import settings


class RedisClient:
    """
    Centralized Redis connection manager.

    Responsibilities:
    - Create and manage the Redis client.
    - Expose the client to application services.
    - Provide health check functionality.
    """

    def __init__(self) -> None:
        self._client: redis.Redis | None = None

    def get_client(self) -> redis.Redis:
        """
        Lazily initialize and return the Redis client.
        """
        if self._client is None:
            self._client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
            )

        return self._client

    def ping(self) -> bool:
        """
        Check Redis connectivity.
        """
        return self.get_client().ping()

    def close(self) -> None:
        """
        Close all connections in the connection pool.
        """
        if self._client is not None:
            self._client.close()


redis_client = RedisClient()