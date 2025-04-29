# tracking/routing.py

from django.urls import re_path
# from . import consumers
from .consumers import LocationConsumer

websocket_urlpatterns = [
    # re_path(r'ws/location/$', consumers.LocationConsumer.as_asgi()),
    # re_path(r'^ws/location/$', consumers.LocationConsumer.as_asgi()),
    re_path(r'ws/location/$', LocationConsumer.as_asgi()),
]