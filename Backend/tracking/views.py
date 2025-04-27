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

#Vehicle Registration
class VehicleCreateView(generics.CreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

# Device Search
@api_view(['GET'])
def device_search(request):
    search_type = request.query_params.get('search_type')
    search_value = request.query_params.get('search_value')
    devices = Device.objects.filter(**{search_type: search_value})
    serializer = DeviceSerializer(devices, many=True)
    return Response(serializer.data)
