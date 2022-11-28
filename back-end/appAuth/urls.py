from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("provinces", viewset=views.ProvinceViewSet)
router.register("cities", viewset=views.CityViewSet, basename="city")
# city_router = routers.NestedDefaultRouter(router, "provinces", lookup="province")
# city_router.register("city", viewset=views.CityViewSet, basename="city")


urlpatterns = router.urls


urlpatterns += [
    path('forgot-password', views.PasswordHandler.forgot_password),
    path('password/reset', views.PasswordHandler.password_reset),
]