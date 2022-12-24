from rest_framework import serializers
from .models import *

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