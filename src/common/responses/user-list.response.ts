import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { Transform } from 'class-transformer';
import { UserResponse } from './user.response';

export class UserListResponse {
    @Transform(({ value }: { value: User[] }) => value.map((user: User) => new UserResponse(user)))
    @ApiProperty({ type: () => [UserResponse] })
    users: UserResponse[];

    constructor(users: User[]) {
        this.users = users.map((user) => new UserResponse(user));
    }
}
