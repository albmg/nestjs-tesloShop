import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  
  constructor(private readonly messagesWsService: MessagesWsService

  ) {}
  handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    console.log({ token });
    // console.log('Cliente conectado', client.id )
    this.messagesWsService.registerClient( client )
    // console.log({ conectados: this.messagesWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect( client: Socket ) {
    // console.log('Cliente desconectado', client.id)        
    this.messagesWsService.removeClient( client.id )
    // console.log({ conectados: this.messagesWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    
    
    // Emit only to the client!
    // message-from-server
    // client.emit('message-from-server', {
    //   fullName: ' Its me!',
    //   message: payload.message || 'no-message!!'
    // })

    // Emit everyone except initial client
    // client.broadcast.emit('message-from-server', {
    //   fullName: ' Its me!',
    //   message: payload.message || 'no-message!!'
    // })

    // Emit everyone
    this.wss.emit('message-from-server', {
      fullName: ' Its me!',
      message: payload.message || 'no-message!!'
    });

  }
}
