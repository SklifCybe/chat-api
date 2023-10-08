import type { Token } from '@prisma/client';

export interface Tokens {
    accessToken: string;
    refreshToken: Token;
}
