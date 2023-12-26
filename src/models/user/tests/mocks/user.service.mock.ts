import type { User } from '@prisma/client';
import type { SignUpDto } from '../../../../authentication/dto/sign-up.dto';
import type { UpdateUserFields } from '../../../../common/types/configuration-user.type';

const firstName = 'First';
const lastName = 'Last';
export const password = '123456';
export const hashedPassword = '654321';
export const salt = '123';
export const id = 'uuid-1234';

export const mockSignUpDto: SignUpDto = {
    email: 'test@gmail.com',
    password,
    firstName,
    lastName,
    userName: 'Sklif',
    confirmPassword: password,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { confirmPassword: _, ...rest } = mockSignUpDto;
export const mockUserReturn: User = {
    ...rest,
    password: hashedPassword,
    mailConfirmed: false,
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    id,
};
export const mockUserRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    confirm: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
};
export const mockUserUpdateFields: UpdateUserFields = {
    firstName,
    lastName,
};
export const mockUpdateFieldsWithPassword: UpdateUserFields = {
    firstName,
    lastName,
    password,
};
