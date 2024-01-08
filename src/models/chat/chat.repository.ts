import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Chat, ChatType } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatRepository {
    private readonly logger = new Logger();

    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
    ) {}

    public async findOneById(id: string): Promise<Chat | null> {
        try {
            return await this.prismaService.chat.findUnique({
                where: { id },
                include: {
                    participants: true,
                    messages: true,
                    lastMessage: true
                },
            });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async create(title: string, type: ChatType, fromUserId: string, toUserId: string): Promise<Chat | null> {
        const existingChat = await this.checkExistingChat(fromUserId, toUserId);

        if (existingChat) {
            return null;
        }

        const fromUser = await this.userService.findOneByEmail(fromUserId);
        const toUser = await this.userService.findOneById(toUserId);

        if (!fromUser || !toUser) {
            return null;
        }

        try {
            return await this.prismaService.chat.create({
                data: {
                    title,
                    type,
                    participants: {
                        connect: [{ id: fromUser.id }, { id: toUser.id }],
                    },
                },
                include: {
                    participants: true,
                    messages: true,
                    lastMessage: true,
                },
            });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async remove(id: string): Promise<Chat | null> {
        try {
            return await this.prismaService.chat.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    private async checkExistingChat(firstUserId: string, secondUserId: string): Promise<boolean | null> {
        try {
            const existingChat = await this.prismaService.chat.findFirst({
                where: {
                    AND: [
                        {
                            participants: {
                                some: { id: firstUserId },
                            },
                        },
                        {
                            participants: {
                                some: { id: secondUserId },
                            },
                        },
                    ],
                },
            });

            return Boolean(existingChat);
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
