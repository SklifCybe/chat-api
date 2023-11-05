import type { Token } from '@prisma/client';

export type Tokens = {
    accessToken: string;
    refreshToken: Token;
}
