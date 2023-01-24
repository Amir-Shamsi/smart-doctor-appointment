from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import CreateTicketSerializer, TicketSerializer, SendMessageSerializer, MessageSerializer
from .models import Ticket, Message

from django.db.models import Q

class TicketViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateTicketSerializer
        return TicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(Q(user = self.request.user) | Q(doctor = self.request.user))
    
    def get_serializer_context(self):
        return {"user": self.request.user, "ticket_id": None if self.kwargs.get("pk") is None else self.kwargs["pk"] }

        


class MessageViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        ticket_id = self.kwargs["nested_1_pk"]
        messages = Message.objects.filter(ticket_id = ticket_id).all()
        return messages
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return SendMessageSerializer
        return MessageSerializer

        
    def create(self, request, *args, **kwargs):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data["message"]
        sender = request.user
        ticket_id = self.kwargs["nested_1_pk"]
        message = Message.objects.create(message=message, sender=sender, ticket_id=ticket_id)
        return Response({"message": message.message}, status=status.HTTP_201_CREATED)
    