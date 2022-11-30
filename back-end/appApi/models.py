from django.db import models

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
