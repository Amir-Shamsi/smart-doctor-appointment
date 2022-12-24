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
from .queries import QueryHandler
from .predictor import model_core, handler
from .serializers import *

class DiseaseController:
    class QuestionIntroSet(ModelViewSet):
        http_method_names = ["get"]
        permission_classes = [IsAuthenticated]
        serializer_class = QuestionIntroSerializer
        queryset = QuestionIntro.objects.all()

# Create your views here.
