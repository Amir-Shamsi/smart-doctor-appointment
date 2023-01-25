from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import *
from appAuth.models import CustomUser
from appAuth.models import PatientFile


class QuestionIntroSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionIntro
        fields = ['id', 'question']


class SymptomsSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)


class PatientDiseaseDataSerializer(serializers.Serializer):
    symptoms = serializers.JSONField()
    detail = serializers.CharField(max_length=2000)
    intro_answer = serializers.JSONField()


class MedicineSerializer(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        return Medicine.objects.all()


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'first_name', 'last_name']


class DiseasePostSerializer(serializers.Serializer):
    disease = serializers.CharField(max_length=255)


class AppointmentSeriallizer(serializers.Serializer):
    disease = serializers.CharField(max_length=255)
    doctor_id = serializers.IntegerField()
    detail = serializers.CharField(max_length=2048)
    date = serializers.DateField()


class PatiensSerializer(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        user = self.context["user"]
        files = PatientFile.objects.filter(patient_doctor=user)
        patients_id = []
        for i in range(len(files)):
            patients_id += [files[i].patient.id]

        queryset = CustomUser.objects.filter(id__in={id for id in patients_id})

        return queryset


class CreateRecipeSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer(many=True)
    patient = PatiensSerializer()

    class Meta:
        model = Recipe
        fields = ["patient", "medicine", "description"]


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["id"]

class BookHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientFile
        fields = ["file_ID", "disease", "patient_doctor", "appointment_date", "date_created", "detail"]
