import type { User } from '@prisma/client';
import type { UpdateUserDto } from '../../dto/update-user.dto';

export const userId = 'uuid-123';
export const updateUserDto: UpdateUserDto = {
    firstName: 'First',
    lastName: 'Last',
    password: 'password',
};
export const updatedUser: User = {
    ...updateUserDto,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'test@mail.com',
    id: userId,
    mailConfirmed: true,
};
export const mockUserService = {
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};
