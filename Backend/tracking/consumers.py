# tracking/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # await self.channel_layer.group_add('Location_updates', self.channel_name)
        # await self.accept()
        try:
            await self.channel_layer.group_add(
                'location_updates',  # Consistent naming
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            print(f"Connection error: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        # await self.channel_layer.group_discard('Location_updates', self.channel_name)
        try:
            await self.channel_layer.group_discard(
                'location_updates',
                self.channel_name
            )
        except Exception as e:
            print(f"Disconnection error: {str(e)}")

    # async def receive(self, text_data):
        # data = json.loads(text_data)
        # await self.channel_layer.group_send(
        #     'Location_updates',
        #     {
        #         'type': 'location_update',
        #         'data': data
        #     }
        # )
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            await self.channel_layer.group_send(
                'location_updates',
                {
                    'type': 'location_update',
                    'data': data
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
        except Exception as e:
            print(f"Receive error: {str(e)}")    

    async def send_location(self, event):
        await self.send(text_data=json.dumps(event['data']))
         