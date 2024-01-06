import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { AllExceptionsSocketFilter } from '../../common/filters/all-exceptions-socket.filter';
import { SendMessageDto } from './dto/send-message.dto';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt.type';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';

@WebSocketGateway()
@UseFilters(new AllExceptionsSocketFilter())
export class ChatGateway {
    @WebSocketServer()
    private readonly server: Server;
    

    constructor(private readonly chatService: ChatService) {}

    @UsePipes(new ValidationPipe())
    @UseGuards(WsJwtAuthGuard)
    @SubscribeMessage('send-message')
    public async handleMessage(@MessageBody() sendMessageDto: SendMessageDto, @User() user: JwtPayload) {
        const { content, chatId } = sendMessageDto;

        const message = await this.chatService.sendMessage(content, user.id, chatId);

        if (!message) {
            throw new WsException('error. not created');
        }

        this.server.emit(`new-message-in-chat-${chatId}`, message);

        return message;
    }
}
