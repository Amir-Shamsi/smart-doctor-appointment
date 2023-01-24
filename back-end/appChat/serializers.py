from rest_framework import serializers

from .models import Ticket, Message
from appAuth.models import PatientFile, CustomUser


class PatientDoctorSerializer(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        
        user = self.context["user"]
        files = PatientFile.objects.filter(patient = user)
        doctors_id = []
        for i in range(len(files)):
            doctors_id += [files[i].patient_doctor.id]

        queryset = CustomUser.objects.filter(id__in={id for id in doctors_id})
        
        return queryset
    



    
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["title", "content", "doctor", "created_at", "id"]



class CreateTicketSerializer(serializers.ModelSerializer):
    patient_doctor = PatientDoctorSerializer()
    class Meta:
        model = Ticket
        fields = ["title", "content", "patient_doctor"]


    def save(self, **kwargs):
        doctor = self.validated_data["patient_doctor"]
        user = self.context["user"]
        title = self.validated_data["title"]
        content = self.validated_data["content"]
        return Ticket.objects.create(user=user, doctor=doctor, title=title, content=content)
    

class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["message"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["message", "sender", "created_at"]

