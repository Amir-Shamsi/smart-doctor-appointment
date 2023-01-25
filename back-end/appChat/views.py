from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from appAuth.models import PatientFile
from .serializers import CreateTicketSerializer, TicketSerializer, SendMessageSerializer, MessageSerializer, \
    DrPatientSerializer
from .models import Ticket, Message

from django.db.models import Q

class TicketViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateTicketSerializer
        return TicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(Q(user = self.request.user) | Q(doctor = self.request.user)).order_by("created_at")
    
    def get_serializer_context(self):
        return {"user": self.request.user, "ticket_id": None if self.kwargs.get("pk") is None else self.kwargs["pk"] }

class MessageViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        ticket_id = self.kwargs["nested_1_pk"]
        messages = Message.objects.filter(ticket_id = ticket_id).all().order_by("created_at")
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

@api_view(['GET'])
def get_available_doctors(request):
    if request.user.is_anonymous:
        return Response({'You must login first!'})
    available_docs = []
    docs = PatientFile.objects.filter(patient=request.user)
    for doc in docs:
        if doc.patient_doctor not in available_docs:
            doci = doc.patient_doctor
            available_docs.append({
                'id': doci.id,
                'first_name': doci.first_name,
                'last_name': doci.last_name
            })
    return Response(available_docs)

@api_view(['GET'])
def get_patients(request):
    if request.user.is_anonymous:
        return Response({'You must login first!'})

    if not request.user.is_doctor:
        return Response({'Access denied!'})
    patients = []
    tmp_p = PatientFile.objects.filter(patient_doctor=request.user)
    for p in tmp_p:
        if p not in patients: patients.append(p.patient.id)
    users = get_user_model().objects.filter(id__in=patients)
    serz = DrPatientSerializer(instance=users, many=True)
    return Response(serz.data)
