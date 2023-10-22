import type { User } from '@prisma/client';
import type { SignUpDto } from '../../../../authentication/dto/sign-up.dto';

const mockPassword = '123456';
export const mockHashedPassword = '654321';
export const mockSalt = '123';

export const mockSignUpDto: SignUpDto = {
    email: 'test@gmail.com',
    password: mockPassword,
    firstName: 'First',
    lastName: 'Second',
    confirmPassword: mockPassword,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { confirmPassword: _, ...rest } = mockSignUpDto;
export const mockUserReturn: User = {
    ...rest,
    password: mockHashedPassword,
    mailConfirmed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'id',
};
