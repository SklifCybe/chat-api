import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
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

    @Transform(({ value }: { value: User[] }) => value.map((user: User) => new UserResponse(user)))
    @ApiProperty({
        example: [
            {
                id: 'uuid-1',
                avatarUrl: null,
                email: 'test@gmail.com',
                firstName: 'Ilya',
                lastName: 'Strelkovskiy',
                updatedAt: new Date(),
                userName: 'sklif',
            },
        ],
    })
    contacts: User[];

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
