from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("provinces", viewset=views.ProvinceViewSet)
router.register("cities", viewset=views.CityViewSet, basename="city")
router.register("insurance-companies", viewset=views.InsuranceCompaniesSet, basename="insurance-companies")
urlpatterns = router.urls
urlpatterns += []

