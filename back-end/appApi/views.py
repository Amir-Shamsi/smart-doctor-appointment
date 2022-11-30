from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *

class InsuranceCompaniesSet(ModelViewSet):
    http_method_names = ["get"]
    serializer_class = InsuranceCompanySerializer
    queryset = InsuranceCompany.objects.all()