# tracking/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('Location_updates', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('Location_updates', self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            'Location_updates',
            {
                'type': 'location_update',
                'data': data
            }
        )

    async def send_location(self, event):
        await self.send(text_data=json.dumps(event['data']))
         