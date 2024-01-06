import { ApiProperty } from '@nestjs/swagger';
import type { Chat, User, Message } from '@prisma/client';
import { ChatType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { UserResponse } from './user.response';

export class ChatResponse implements Chat {
    @ApiProperty({ example: '4076f91a-c64a-4d45-8e49-ee380539c867' })
    id: string;

    @ApiProperty({ example: 'Chat Title' })
    title: string;

    @ApiProperty({ example: ChatType.Direct })
    type: ChatType;

    @ApiProperty({
        example: [
            {
                id: '4f80478c-aacd-426a-97ec-f8f0be997615',
                userName: 'rouber',
                firstName: 'Evgeniy',
                lastName: 'Fedosenko',
                email: 'test@gmail.com',
                avatarUrl:
                    'https://res.cloudinary.com/dyfochejl/image/private/s--0Svk5duW--/v1703625408/default_avatars/dm8bzdvovql0w1bgragf.png',
                updatedAt: new Date(),
            },
            {
                id: '7cd60ab7-1413-4116-91f7-5579beccdc02',
                userName: 'sklif',
                firstName: 'Ilya',
                lastName: 'Strelkovskiy',
                email: 'test2@gmail.com',
                avatarUrl:
                    'https://res.cloudinary.com/dyfochejl/image/private/s--2M9yhnpE--/v1703625241/default_avatars/svz84huykjc1f8op0ywl.png',
                updatedAt: new Date(),
            },
        ],
    })
    @Transform(({ value }: { value: User[] }) => value.map((user: User) => new UserResponse(user)))
    participants: UserResponse[];

    @ApiProperty({
        example: [
            {
                id: 'b348a40a-c08d-4aa4-b24a-41db70e8ab60',
                content: 'Hello',
                createdAt: new Date(),
                updatedAt: new Date(),
                senderId: '7cd60ab7-1413-4116-91f7-5579beccdc02',
                chatId: '4d3bf758-f853-423a-a21e-e6eae35525cd',
            },
            {
                id: 'b504829d-38f8-4847-8577-52b2c9e1810a',
                content: 'World',
                createdAt: new Date(),
                updatedAt: new Date(),
                senderId: '7cd60ab7-1413-4116-91f7-5579beccdc02',
                chatId: '4d3bf758-f853-423a-a21e-e6eae35525cd',
            },
        ],
    })
    messages: Message[];

    constructor(chat: Chat) {
        Object.assign(this, chat);
    }
}
