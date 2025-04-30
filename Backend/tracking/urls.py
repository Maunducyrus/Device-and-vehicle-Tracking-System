# tracking/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('devices/', views.DeviceCreateView.as_view(), name='device-create'),
    path('vehicles/', views.VehicleCreateView.as_view(), name='vehicle-create'),
    path('api/devices/search/', views.device_search, name='device-search'),
    path('api/vehicles/search/', views.vehicle_search, name='vehicle-search'),
    path('devices/<int:pk>/location/', views.update_device_location, name='update-device-location'),
    path('vehicles/<int:pk>/location/', views.update_vehicle_location, name='update-vehicle-location'),
]