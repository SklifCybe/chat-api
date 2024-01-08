import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Message } from '@prisma/client';
import { UserService } from '../user/user.service';
import { ChatRepository } from './chat.repository';

// todo: create message module
@Injectable()
export class MessageRepository {
    private readonly logger = new Logger();

    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly chatRepository: ChatRepository,
    ) {}

    public async create(content: string, senderId: string, chatId: string): Promise<Message | null> {
        try {
            const sender = await this.userService.findOneById(senderId);
            const chat = await this.chatRepository.findOneById(chatId);

            if (!sender || !chat) {
                return null;
            }

            const newMessage = await this.prismaService.message.create({
                data: {
                    content,
                    sender: {
                        connect: { id: senderId },
                    },
                    chat: {
                        connect: { id: chatId },
                    },
                    lastMessageInChat: {
                        connect: { id: chatId }
                    }
                },
            });

            await this.prismaService.chat.update({
                where: { id: chatId },
                data: { lastMessage: { connect: { id: newMessage.id } } },
            });

            return newMessage;
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async remove(messageId: string): Promise<Message | null> {
        try {
            return await this.prismaService.message.delete({
                where: {
                    id: messageId,
                },
            });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async update(messageId: string, content: string): Promise<Message | null> {
        try {
            return await this.prismaService.message.update({
                where: { id: messageId },
                data: { content },
            });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
