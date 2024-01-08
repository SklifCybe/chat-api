import { ApiProperty } from '@nestjs/swagger';
import type { Chat } from '@prisma/client';
import { type User, ChatType } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

export class UserResponse implements User {
    @ApiProperty({ example: '5779afb5-d3de-4434-9bab-92625270e530' })
    id: string;

    @ApiProperty({ example: 'Ilya' })
    firstName: string;

    @ApiProperty({ example: 'Strelkovskiy' })
    lastName: string;

    @ApiProperty({ example: 'Sklif' })
    userName: string;

    @ApiProperty({ example: 'i.s.toaccept@gmail.com' })
    email: string;

    @ApiProperty({ example: '2023-10-26T16:48:29.355Z' })
    updatedAt: Date;

    @ApiProperty({ example: 'https://res.cloudinary.com/dyfochejl/image/upload/v1699032885/jfhrcsnyttuswho9hhty.png' })
    avatarUrl: string;

    @ApiProperty({
        example: [
            {
                id: 'chat-id-1',
                title: 'Chat Title',
                type: ChatType.Direct,
                lastMessage: null,
            },
            {
                id: 'chat-id-2',
                title: 'Chat Title 2',
                type: ChatType.Group,
                lastMessage: {
                    id: '2a1171bf-7429-430b-b7c3-cff624becfb0',
                    content: 'Hello world',
                    updatedAt: '2024-01-08T16:13:59.575Z',
                    senderId: '21aa2667-8e70-445a-8b85-54d2f01fd1c5',
                },
            },
        ],
    })
    @Transform(({ value }: { value: Chat[] }) =>
        value.map((chat: any) => {
            if (!chat.lastMessage) {
                return {
                    id: chat.id,
                    title: chat.title,
                    type: chat.type,
                    lastMessage: null,
                };
            }

            return {
                id: chat.id,
                title: chat.title,
                type: chat.type,
                lastMessage: {
                    id: chat.lastMessage.id,
                    content: chat.lastMessage.content,
                    updatedAt: chat.lastMessage.updatedAt,
                    senderId: chat.lastMessage.senderId,
                },
            };
        }),
    )
    chats: Chat[];

    @Exclude()
    mailConfirmed: boolean;

    @Exclude()
    password: string;

    @Exclude()
    createdAt: Date;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
