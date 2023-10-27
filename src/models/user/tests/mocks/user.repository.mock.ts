import type { User } from '@prisma/client';
// todo: create one folder, then have all mocks from all project
export const mockUserArguments = {
    data: {
        firstName: 'First',
        lastName: 'Last',
        email: 'test@mail.ru',
        password: '123456',
    },
};
export const mockUserCreated: User = {
    ...mockUserArguments.data,
    mailConfirmed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'id',
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
