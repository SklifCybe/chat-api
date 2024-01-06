import type { User } from '@prisma/client';
import type { UpdateUserFields } from 'src/common/types/configuration-user.type';
// todo: create one folder, then have all mocks from all project or use local mocks in test files

const firstName = 'First';
const lastName = 'Last';
export const userId = 'uuid-1234';
export const mockUserArguments = {
    data: {
        firstName,
        lastName,
        userName: 'Sklif',
        email: 'test@mail.ru',
        password: '123456',
        avatarUrl: 'http://avatar.png',
    },
    include: {
        chats: true
    }
};
export const mockUserCreated: User = {
    ...mockUserArguments.data,
    mailConfirmed: false,
    avatarUrl: 'http://avatar.png',
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
        findMany: jest.fn(),
        count: jest.fn(),
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
