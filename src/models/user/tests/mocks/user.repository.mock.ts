import type { User } from '@prisma/client';
import type { UpdateUserFields } from 'src/common/types/configuration-user.type';
// todo: create one folder, then have all mocks from all project

const firstName = 'First';
const lastName = 'Last';
export const userId = 'uuid-1234';
export const mockUserArguments = {
    data: {
        firstName,
        lastName,
        email: 'test@mail.ru',
        password: '123456',
    },
};
export const mockUserCreated: User = {
    ...mockUserArguments.data,
    mailConfirmed: false,
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: userId,
};
export const mockUserConfirmed: User = {
    ...mockUserCreated,
    mailConfirmed: true,
};
export const mockPrismaService = {
    user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    },
};
export const mockCacheManagerService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
};
export const updateFields: UpdateUserFields = {
    firstName,
    lastName,
};
export const userUpdated: User = {
    ...mockUserConfirmed,
    ...updateFields,
};
