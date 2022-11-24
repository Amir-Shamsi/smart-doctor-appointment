from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("add-province", viewset=views.AddProvinceByAdminViewSet)

urlpatterns = router.urls

urlpatterns += [
    path('forgot-password', views.PasswordHandler.forgot_password),
    path('password/reset', views.PasswordHandler.password_reset),
]