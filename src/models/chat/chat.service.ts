import { Injectable } from '@nestjs/common';
import type { CreateChatDto } from './dto/create-chat.dto';
import { ChatRepository } from './chat.repository';
import type { Chat, Message } from '@prisma/client';
import { MessageRepository } from './message.repository';

@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly messageRepository: MessageRepository,
    ) {}

    public async findOneById(id: string): Promise<Chat | null> {
        return this.chatRepository.findOneById(id);
    }

    public async create(userId: string, createChatDto: CreateChatDto): Promise<Chat | null> {
        const { title, type, participantId } = createChatDto;

        return this.chatRepository.create(title, type, userId, participantId);
    }

    public async remove(id: string): Promise<Chat | null> {
        return this.chatRepository.remove(id);
    }

    public async sendMessage(content: string, senderId: string, chatId: string): Promise<Message | null> {
        return this.messageRepository.create(content, senderId, chatId);
    }
}
