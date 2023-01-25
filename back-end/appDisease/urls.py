from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("question-intro", viewset=views.DiseaseController.QuestionIntroSet, basename="question-intro")
router.register("send-recipe", viewset=views.CreateRecipeViewSet, basename="send-recipe")

urlpatterns = router.urls
urlpatterns += [
    path('symptoms/', views.DiseaseController.get_symptoms),
    path('analysis/', views.DiseaseController.disease_data_analysis),
    path('get-doctors/', views.DiseaseController.get_related_doctors),
    path('set-appointment/', views.DiseaseController.set_appointment)
]
