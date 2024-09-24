import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient( client, payload.id );
    } catch(error) {
      client.disconnect();
      return;
    }
    console.log({ payload });
    // console.log('Cliente conectado', client.id )
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
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });

  }
}
