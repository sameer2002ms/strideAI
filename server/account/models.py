from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom user model for ChatWithDoc.

    Extends Django's AbstractUser so we can
    add application-specific fields in the future.
    """

    pass