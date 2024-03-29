import datetime

from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.conf import settings
import uuid
from appApi.models import City, ProvinceState, InsuranceCompany


class CustomUserManager(BaseUserManager):
    def create_user(self, personal_ID, password, email, **extra_fields):
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
    zip_code = models.CharField(max_length=64)
    has_health_insurance = models.BooleanField(default=0)
    health_insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.PROTECT, blank=True, null=True)

    # these fields are related to doctors
    is_doctor = models.BooleanField(default=False, blank=True, null=True)
    doctor_code = models.CharField(max_length=6, default=None, blank=True, null=True)
    expertise = models.CharField(blank=True, null=True, default='', max_length=255)

    USERNAME_FIELD = 'personal_ID'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        if self.first_name or self.last_name:
            return f'{self.first_name} {self.last_name}'
        return self.personal_ID


class PatientFile(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="file")
    disease = models.CharField(max_length=255)
    file_ID = models.CharField(unique=True, default=uuid.uuid4().hex[:6].upper(), max_length=6)
    detail = models.TextField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now=True)
    appointment_date = models.DateField(null=True, blank=True, default=datetime.date.today())
    # this field determines every patient doctor(s)
    patient_doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="doctor",
                                       default=None)


class UserHashTable(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    expire_date = models.DateTimeField()
