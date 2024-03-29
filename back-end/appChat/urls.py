from rest_framework_nested import routers
from . import views
from django.urls import path

router = routers.SimpleRouter()

router.register("send-ticket", viewset=views.TicketViewSet, basename="my-ticket")

message_router = routers.NestedDefaultRouter(router, "send-ticket")
message_router.register("messages", viewset=views.MessageViewSet, basename="messages")

urlpatterns = router.urls + message_router.urls
urlpatterns += [
    path('available-doctors/', views.get_available_doctors),
    path('get-patients/', views.get_patients),
]