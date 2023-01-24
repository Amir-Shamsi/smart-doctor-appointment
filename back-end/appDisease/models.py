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
    