from django.db import models
from django.conf import settings

class QuestionIntro(models.Model):
    question = models.CharField(max_length=255)

    def __str__(self):
        return self.question



class Medicine(models.Model):
    name = models.CharField(max_length=256, blank=False)
    amount = models.PositiveIntegerField(default=1)

    def __str__(self) -> str:
        return self.name
    

class Recipe(models.Model):
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recipe")
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="patient-recipe")
    created_at = models.DateTimeField(auto_now=True)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name="needed-drugs")
    description = models.CharField(max_length=2000)