from channels.generic.websocket import AsyncWebsocketConsumer
import json


class WorkspaceConsumer(AsyncWebsocketConsumer):
    # Joining to workspace
    async def connect(self):
        self.workspace_name = self.scope['url_route']['kwargs']['workspace_name']
        self.workspace_group_name = 'workspace_%s' % self.workspace_name

        await self.channel_layer.group_add(
            self.workspace_group_name,
            self.channel_name
        )

        await self.accept()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.workspace_group_name,
            {
                'type': 'task_message',
                'message': message
            }
        )

    # Receive new task from other client
    async def task_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    # Disconnecting from workspace
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.workspace_group_name,
            self.channel_name
        )