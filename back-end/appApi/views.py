from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *

class ProvinceViewSet(ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ProvinceSerializer
    queryset = ProvinceState.objects.all()

class CityViewSet(ModelViewSet):
    http_method_names = ["post"]
    serializer_class = FindCityByProvinceSerializer
    queryset = City.objects.select_related("province").all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        province_pk = serializer.validated_data["province_id"]
        cities = City.objects.filter(province_id=province_pk)
        c_serializer = CitySerializer(cities, many=True)
        return Response(c_serializer.data)

class InsuranceCompaniesSet(ModelViewSet):
    http_method_names = ["get"]
    serializer_class = InsuranceCompanySerializer
    queryset = InsuranceCompany.objects.all()