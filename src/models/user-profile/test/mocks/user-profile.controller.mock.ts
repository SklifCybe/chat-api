import { Buffer } from 'buffer';
import { Readable } from 'stream';
import type { User } from '@prisma/client';
import type { UpdateUserDto } from '../../dto/update-user.dto';
import type { JwtPayload } from '../../../../common/types/jwt.type';
import type { File } from '../../../../common/types/file.type';

export const userId = 'uuid-123';
export const updateUserDto: UpdateUserDto = {
    firstName: 'First',
    lastName: 'Last',
    password: 'password',
};
export const user: User = {
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'test@mail.com',
    avatarUrl: null,
    firstName: 'First',
    lastName: 'Last',
    id: userId,
    mailConfirmed: true,
    password: 'some-password',
};
export const mockUserProfileService = {
    update: jest.fn(),
    remove: jest.fn(),
    getCurrentUser: jest.fn(),
};
export const jwtPayload: JwtPayload = {
    id: userId,
    email: 'test@mail.com',
    exp: Date.now(),
    iat: Date.now(),
};
export const file: File = {
    fieldname: 'file',
    originalname: 'file.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.alloc(5),
    size: 172922,
    destination: 'destination',
    filename: 'file.png',
    path: '/',
    stream: new Readable(),
};
