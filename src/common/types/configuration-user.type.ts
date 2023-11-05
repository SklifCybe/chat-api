import type { User } from '@prisma/client';

type AllowFields = Pick<User, 'firstName' | 'lastName' | 'mailConfirmed' | 'password' | 'avatarUrl'>;

export type UpdateUserFields = Partial<AllowFields>;
