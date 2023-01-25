from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import *
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *
from .predictor import handler
from .serializers import *
from .permissions import IsDoctor
from django.contrib.auth import get_user_model


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
        try:
            pred = handler.PredictHandler(symptoms)
        except ValueError:
            return Response({'symptoms are not right'})

        return Response({'disease': pred.get_result(),
                         'precaution': pred.get_precaution(pred.get_result()),
                         'description': pred.get_description(pred.get_result())
                         })

    @staticmethod
    @api_view(['POST'])
    def get_related_doctors(request):
        if request.user.is_anonymous:
            return Response({'You must login first!'})
        serz = DiseasePostSerializer(data=request.data)
        serz.is_valid(raise_exception=True)
        disease = serz['disease']
        specialist_disease = open('predictor/dataset/DoctorRecommendation.csv').read().split('\n')
        specialist = ''
        for sd in specialist_disease:
            if disease in sd.split(',')[0].strip():
                specialist = sd.split(',')[1].strip()
                break
        User = get_user_model()
        docs = User.objects.filter(expertise=specialist)

        ser = DoctorSerializer(instance=docs, many=True)
        return Response(ser.data)

    @staticmethod
    @api_view(['POST'])
    def set_appointment(request):
        if request.user.is_anonymous:
            return Response({'You must login first!'})
        serz = AppointmentSeriallizer(data=request.data)
        serz.is_valid(raise_exception=True)
        disease = serz['disease']
        doctor_id = int(serz['doctor_id'])
        detail = serz['detail']
        date = serz['date']

        patientFile = PatientFile()
        patientFile.patient = request.user
        patientFile.detail = detail
        patientFile.appointment_date = date
        patientFile.patient_doctor = doctor_id
        patientFile.disease = disease
        patientFile.save()

        return Response({'Appointment set successfully!'})


class CreateRecipeViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateRecipeSerializer
        return RecipeSerializer

    def get_queryset(self):
        doctor = self.request.user
        recipes = Recipe.objects.filter(doctor=doctor).all()
        return recipes

    def get_serializer_context(self):
        return {"user": self.request.user}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_book_history(request):
    if request.user.is_anonymous:
        return Response({'You must login first!'})

    patients_files = PatientFile.objects.filter(patient=request.user)
    serz = BookHistorySerializer(instance=patients_files, many=True)
    return Response(serz.data)