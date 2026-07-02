from __future__ import annotations

from django.http import JsonResponse

from services.rate_limiter import RateLimiterService

from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class RateLimitMiddleware:
    """
    Django middleware that enforces request rate limiting.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limiter = RateLimiterService()
    
    def _is_excluded_path(self, path: str) -> bool:
        """
        Return True if the request path should bypass rate limiting.
        """
        return path.startswith(settings.RATE_LIMIT_EXCLUDED_PATHS)        
        
    def _add_rate_limit_headers(self, response, result):
        response["X-RateLimit-Limit"] = str(result.limit)
        response["X-RateLimit-Remaining"] = str(result.remaining)
        response["X-RateLimit-Reset"] = str(result.reset_at)

        if result.retry_after is not None:
            response["Retry-After"] = str(result.retry_after)

        return response    

    def _get_client_ip(self, request) -> str:
        """
        Extract the client's IP address.

        If the application is behind a reverse proxy, the client's
        original IP may be available in the X-Forwarded-For header.
        """

        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")

        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        return request.META.get("REMOTE_ADDR", "unknown")

    def __call__(self, request):
        """
        Enforce rate limiting for incoming requests.
        """
        
        if self._is_excluded_path(request.path):
            return self.get_response(request)

        client_ip = self._get_client_ip(request)
        identifier = f"ip:{client_ip}"

        result = self.rate_limiter.is_allowed(identifier)

        if not result.allowed:
            logger.warning(
                "Rate limit exceeded | ip=%s | method=%s | path=%s | retry_after=%s",
                client_ip,
                request.method,
                request.path,
                result.retry_after,
            )
            response = JsonResponse(
                {
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please try again later."
                    },
                    "rate_limit": {
                        "limit": result.limit,
                        "current_count": result.current_count,
                        "remaining": result.remaining,
                        "retry_after": result.retry_after,
                        "reset_at": result.reset_at,
                    },
                },
                status=429,
            )
            return self._add_rate_limit_headers(response, result)
        response = self.get_response(request)
        return self._add_rate_limit_headers(response, result)
    
