from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("add-province", viewset=views.AddProvinceByAdminViewSet)

city_router = routers.NestedDefaultRouter(router, "add-province", lookup="province")
city_router.register("add-city", viewset=views.AddCityForProvinceByAdminViewSet, basename="city")


urlpatterns = router.urls + city_router.urls

urlpatterns += [
    path('forgot-password', views.PasswordHandler.forgot_password),
    path('password/reset', views.PasswordHandler.password_reset),
]