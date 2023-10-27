import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
    EXAMPLE_UUID,
    EXAMPLE_FIRST_NAME,
    EXAMPLE_LAST_NAME,
    EXAMPLE_EMAIL,
    EXAMPLE_UPDATE_AT,
} from '../constants/swagger-example.constant';

export class UserResponse implements User {
    @ApiProperty({ example: EXAMPLE_UUID })
    id: string;

    @ApiProperty({ example: EXAMPLE_FIRST_NAME })
    firstName: string;

    @ApiProperty({ example: EXAMPLE_LAST_NAME })
    lastName: string;

    @ApiProperty({ example: EXAMPLE_EMAIL })
    email: string;

    @ApiProperty({ example: EXAMPLE_UPDATE_AT })
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
