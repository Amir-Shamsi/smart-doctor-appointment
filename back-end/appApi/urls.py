from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("provinces", viewset=views.ProvinceViewSet)
router.register("cities", viewset=views.CityViewSet, basename="city")
urlpatterns = router.urls
urlpatterns += []

