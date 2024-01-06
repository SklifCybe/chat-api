import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthenticationConfigService } from '../../config/authentication/config.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { UserModule } from '../user/user.module';
import { MessageRepository } from './message.repository';

@Module({
    imports: [UserModule],
    controllers: [ChatController],
    providers: [ChatGateway, AuthenticationConfigService, ChatService, ChatRepository, MessageRepository],
})
export class ChatModule {}
