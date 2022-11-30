
class FindCityByProvinceSerializer(serializers.Serializer):
    province_id = serializers.IntegerField()

class InsuranceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceCompany
        fields = ["id", "name"]