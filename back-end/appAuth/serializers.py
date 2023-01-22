from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from .models import *

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'personal_ID', 'password', 'first_name', 'last_name',
                  'email', 'city', 'contact_number', 'gender', 'birth_date',
                  'has_health_insurance', 'zip_code', 'health_insurance_company', 'is_doctor', 'doctor_code']

class ForgotPasswordSerializer(serializers.Serializer):
    personal_ID = serializers.CharField(max_length=10, min_length=10)
    email = serializers.EmailField(max_length=50)

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField(min_length=8)

    def validate(self, data):
        return serializers.ValidationError('Passwords doesn\'t match.') if data['password'] != data['confirm_password'] else data