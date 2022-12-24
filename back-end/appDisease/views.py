import datetime
import hashlib
import pytz
from django.template.loader import get_template
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from rest_framework.decorators import api_view
from rest_framework.permissions import *
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import *
from .predictor import model_core, handler
from .serializers import *

class DiseaseController:
    class QuestionIntroSet(ModelViewSet):
        http_method_names = ["get"]
        permission_classes = [IsAuthenticated]
        serializer_class = QuestionIntroSerializer
        queryset = QuestionIntro.objects.all()

    @staticmethod
    @api_view(['get'])
    def get_symptoms(request):
        if request.user.is_authenticated:
            return Response(handler.PredictHandler.get_symptoms())
        return Response({'You must login first!'})

    @staticmethod
    @api_view(['post'])
    def disease_data_analysis(request):
        if request.user.is_anonymous:
            return Response({'You must login first!'})
        serializer = PatientDiseaseDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        symptoms = serializer.validated_data.get('symptoms', [])
        detail = serializer.validated_data['detail']
        try: pred = handler.PredictHandler(symptoms)
        except ValueError: return Response({'symptoms are not right'})
        return Response({'disease': pred.get_result(),
                         'precaution': pred.get_precaution(pred.get_result()),
                         'description': pred.get_description(pred.get_result())
                         })


        # TODO: Save patient detail




