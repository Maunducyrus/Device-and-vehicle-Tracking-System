# alerts/urls.py
from django.urls import path
from .views import AlertCreateView, AlertListView

urlpatterns = [
    path('alerts/', AlertCreateView.as_view(), name='alert-create'),
    path('alerts/list/', AlertListView.as_view(), name='alert-list'),
]
