from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.conf import settings
import uuid

class ProvinceState(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name

class City(models.Model):
    city = models.CharField(max_length=64)
    province = models.ForeignKey(ProvinceState, on_delete=models.PROTECT)

    def __str__(self):
        return self.city

class InsuranceCompany(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class CustomUserManager(BaseUserManager):
    def create_user(self, personal_ID, password, email,  **extra_fields):
        user = self.model(personal_ID=personal_ID, email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save()
        return user

class CustomUser(AbstractUser):
    username = None
    personal_ID = models.CharField(unique=True, max_length=10)
    city = models.ForeignKey(City, on_delete=models.PROTECT)
    birth_date = models.DateField()
    gender = models.BooleanField()
    contact_number = models.CharField(max_length=11)
    email = models.CharField(null=True, blank=True, max_length=255)
    zip_code = models.CharField(max_length=64)
    has_health_insurance = models.BooleanField(default=0)
    health_insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.PROTECT, blank=True, null=True)

    USERNAME_FIELD = 'personal_ID'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        if self.first_name or self.last_name:
            return f'{self.first_name} {self.last_name}'
        return self.personal_ID

class PatientFile(models.Model):
    patient = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    file_ID = models.CharField(unique=True, default=uuid.uuid4().hex[:6].upper(), max_length=6)
    date_created = models.DateTimeField(auto_now=True)
