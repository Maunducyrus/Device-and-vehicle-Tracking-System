# Create your views here.

#alerts/views.py
from rest_framework import generics
from .models import Alert
from .serializers import AlertSerializer

# Alert registration
class AlertCreateView(generics.CreateAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

# Alert listing
class AlertListView(generics.ListAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer