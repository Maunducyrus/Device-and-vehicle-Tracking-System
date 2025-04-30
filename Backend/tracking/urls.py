# tracking/urls.py

from django.urls import path
from . import views
from tracking.views import device_search, vehicle_search

urlpatterns = [
    path('devices/', views.DeviceCreateView.as_view(), name='device-create'),
    path('vehicles/', views.VehicleCreateView.as_view(), name='vehicle-create'),
    path('devices/search/', views.device_search, name='device-search'),
    path('vehicles/search/', views.vehicle_search, name='vehicle-search'),
    path('devices/<int:pk>/location/', views.update_device_location, name='update-device-location'),
    path('vehicles/<int:pk>/location/', views.update_vehicle_location, name='update-vehicle-location'),
]
