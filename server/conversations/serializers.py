from rest_framework import serializers

from .models import Conversation, Message
from .services import (
    add_message,
    create_conversation,
)


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = (
            "id",
            "sender",
            "message_type",
            "content",
            "metadata",
            "created_at",
        )

        read_only_fields = (
            "id",
            "created_at",
        )

    def validate_metadata(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "metadata must be an object."
            )
        return value



class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Conversation
        fields = (
            "id",
            "channel",
            "status",
            "metadata",
            "started_at",
            "ended_at",
            "created_at",
            "updated_at",
            "messages",
        )

        read_only_fields = (
            "id",
            "status",
            "started_at",
            "ended_at",
            "created_at",
            "updated_at",
            "messages",
        )

    def validate_metadata(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "metadata must be an object."
            )
        return value

    def create(self, validated_data):
        user = self.context["request"].user

        return create_conversation(
            user=user,
            **validated_data,
        )
        
        
class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(
        max_length=5000,
        trim_whitespace=True,
    )