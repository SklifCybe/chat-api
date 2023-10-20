import type { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    id: string;

    firstName: string;

    lastName: string;

    email: string;

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
