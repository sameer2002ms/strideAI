from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsConversationOwner
from .selectors import (
    get_conversation_messages,
    get_user_conversation_or_404,
    get_user_conversations,
)
from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    SendMessageSerializer,
)
from .services import (
    abandon_conversation,
    delete_conversation,
    end_conversation,
    send_message,
)


class ConversationListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  -> List authenticated user's conversations
    POST -> Create a new conversation
    """

    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        status_filter = self.request.query_params.get("status")
        return get_user_conversations(
            self.request.user,
            status=status_filter,
        )

    def perform_create(self, serializer):
        serializer.save()


class ConversationRetrieveDestroyAPIView(
    generics.RetrieveDestroyAPIView
):
    """
    GET
    DELETE
    """

    serializer_class = ConversationSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsConversationOwner,
    ]

    def get_object(self):
        conversation = get_user_conversation_or_404(
            self.request.user,
            self.kwargs["pk"],
        )

        self.check_object_permissions(
            self.request,
            conversation,
        )

        return conversation

    def perform_destroy(self, instance):
        delete_conversation(instance)


class ConversationMessagesAPIView(generics.ListCreateAPIView):
    """
    GET  -> List conversation messages
    POST -> Add a new message
    """

    serializer_class = SendMessageSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsConversationOwner,
    ]

    def get_conversation(self):
        conversation = get_user_conversation_or_404(
            self.request.user,
            self.kwargs["pk"],
        )

        self.check_object_permissions(
            self.request,
            conversation,
        )

        return conversation

    def get_queryset(self):
        conversation = self.get_conversation()
        return get_conversation_messages(conversation)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["conversation"] = self.get_conversation()
        return context

    def create(self, request, *args, **kwargs):
        conversation = self.get_conversation()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user_message, assistant_message = send_message(
            conversation=conversation,
            content=serializer.validated_data["content"],
        )

        return Response(
            {
                "user_message": MessageSerializer(user_message).data,
                "assistant_message": MessageSerializer(
                    assistant_message
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class EndConversationAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsConversationOwner,
    ]

    def post(self, request, pk):
        conversation = get_user_conversation_or_404(
            request.user,
            pk,
        )

        self.check_object_permissions(
            request,
            conversation,
        )

        end_conversation(conversation)

        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_200_OK,
        )


class AbandonConversationAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsConversationOwner,
    ]

    def post(self, request, pk):
        conversation = get_user_conversation_or_404(
            request.user,
            pk,
        )

        self.check_object_permissions(
            request,
            conversation,
        )

        abandon_conversation(conversation)

        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_200_OK,
        )