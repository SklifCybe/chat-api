import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    @ApiProperty({ example: '5779afb5-d3de-4434-9bab-92625270e530' })
    id: string;

    @ApiProperty({ example: 'Ilya' })
    firstName: string;

    @ApiProperty({ example: 'Strelkovskiy' })
    lastName: string;

    @ApiProperty({ example: 'i.s.toaccept@gmail.com' })
    email: string;

    @ApiProperty({ example: '2023-10-26T16:48:29.355Z' })
    updatedAt: Date;

    @Exclude()
    mailConfirmed: boolean;

    @Exclude()
    password: string;

    @Exclude()
    createdAt: Date;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}
