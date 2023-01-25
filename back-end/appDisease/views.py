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
from .permissions import IsDoctor

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




class CreateRecipeViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsDoctor]
    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateRecipeSerializer
        return RecipeSerializer
    def get_queryset(self):
        doctor = self.request.user
        recipes = Recipe.objects.filter(doctor = doctor).all()
        return recipes
    
    def get_serializer_context(self):
        return {"user": self.request.user}
    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

