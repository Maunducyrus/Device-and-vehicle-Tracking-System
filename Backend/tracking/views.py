# Create your views here.

from rest_framework import generics, status
from rest_framework.response import Response
from .models import Device, Vehicle
from .serializers import DeviceSerializer, VehicleSerializer
from rest_framework.decorators import api_view

# Device Registration
class DeviceCreateView(generics.CreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer