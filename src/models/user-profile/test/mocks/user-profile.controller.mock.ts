import type { User } from '@prisma/client';
import type { UpdateUserDto } from '../../dto/update-user.dto';

export const userId = 'uuid-123';
export const updateUserDto: UpdateUserDto = {
    firstName: 'First',
    lastName: 'Last',
    password: 'password',
};
export const updatedUser: User = {
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'test@mail.com',
    firstName: 'First',
    lastName: 'Last',
    id: userId,
    mailConfirmed: true,
    password: 'some-password',
};
export const mockUserProfileService = {
    update: jest.fn(),
};
