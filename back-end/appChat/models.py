from django.db import models
from django.conf import settings
# Create your models here.


class Ticket(models.Model):
    title = models.CharField(max_length=256)
    content = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_message")
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_message")
    


class Message(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    message = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
