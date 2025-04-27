# tracking/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('Location_updates', self.channel_name)
        await self.accept()