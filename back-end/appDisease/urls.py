from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("question-intro", viewset=views.DiseaseController.QuestionIntroSet, basename="question-intro")

urlpatterns = router.urls
urlpatterns += [
    path('symptoms/', views.DiseaseController.get_symptoms),
    path('analysis/', views.DiseaseController.disease_data_analysis)
]