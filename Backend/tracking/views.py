# Create your views here.

from rest_framework import generics, status
from rest_framework.response import Response
from .models import Device, Vehicle
from .serializers import DeviceSerializer, VehicleSerializer
from rest_framework.decorators import api_view
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

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

# Vehicle Search
@api_view(['GET'])
def vehicle_search(request):
    search_type = request.query_params.get('search_type')
    search_value = request.query_params.get('search_value')
    vehicles = Vehicle.objects.filter(**{search_type: search_value})
    serializer = VehicleSerializer(vehicles, many=True)
    return Response(serializer.data)

# Update Device Location
@api_view(['PATCH'])
def update_device_location(request, pk):
    try:
       device = Device.objects.get(pk=pk)
       device.last_latitude = request.data.get('latitude')
       device.last_longitude = request.data.get('longitude')
       device.save()
       return Response({'message': 'Device location updated successfully'}, status=status.HTTP_200_OK)
    except Device.DoesNotExist:
       return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)
    
# Update Vehicle Location
@api_view(['PATCH'])
def update_vehicle_location(request, pk):
    try:
       vehicle = Vehicle.objects.get(pk=pk)
       vehicle.last_latitude = request.data.get('latitude')
       vehicle.last_longitude = request.data.get('longitude')
       vehicle.save()
       return Response({'message': 'Vehicle location updated successfully'}, status=status.HTTP_200_OK)
    except Vehicle.DoesNotExist:
       return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)