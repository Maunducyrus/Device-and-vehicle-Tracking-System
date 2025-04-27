# Create your views here.

#alerts/views.py
from rest_framework import generics
from .models import Alert
from .serializers import AlertSerializer