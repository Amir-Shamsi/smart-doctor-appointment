from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'personal_ID', 'password', 'first_name', 'last_name',
                  'email', 'city', 'contact_number', 'gender', 'birth_date',
                  'has_health_insurance', 'zip_code', 'health_insurance_company']