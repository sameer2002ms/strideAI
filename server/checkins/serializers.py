from rest_framework import serializers

from .models import CheckIn
from .services import create_checkin


class CheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckIn
        fields = (
            "id",
            "goal",
            "date",
            "status",
            "notes",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        return create_checkin(**validated_data)