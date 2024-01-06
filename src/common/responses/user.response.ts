import { ApiProperty } from '@nestjs/swagger';
import { type User, type Chat, ChatType } from '@prisma/client';
import { Exclude } from 'class-transformer';

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
            },
            {
                id: 'chat-id-2',
                title: 'Chat Title 2',
                type: ChatType.Group,
            },
        ],
    })
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
