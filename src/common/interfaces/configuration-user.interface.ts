import type { User } from '@prisma/client';

type AllowFields = Pick<User, 'firstName' | 'lastName' | 'mailConfirmed' | 'password'>;

export interface ConfigurationUser {
    updateFields: Partial<AllowFields>;
}
