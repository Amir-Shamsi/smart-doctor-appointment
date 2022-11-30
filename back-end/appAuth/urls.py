from django.urls import path
from . import views

urlpatterns = [
    path('forgot-password', views.PasswordHandler.forgot_password),
    path('password/reset', views.PasswordHandler.password_reset),
]