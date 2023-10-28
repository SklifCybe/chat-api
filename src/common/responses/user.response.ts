import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { examples } from '../../swagger/config.json';

const { uuid, first_name, last_name, email, update_at } = examples;

export class UserResponse implements User {
    @ApiProperty({ example: uuid })
    id: string;

    @ApiProperty({ example: first_name })
    firstName: string;

    @ApiProperty({ example: last_name })
    lastName: string;

    @ApiProperty({ example: email })
    email: string;

    @ApiProperty({ example: update_at })
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
