import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensRepository } from './tokens.repository';
import type { Token } from '@prisma/client';
import type { Tokens } from '../../common/types/tokens.type';

@Injectable()
export class TokensService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tokensRepository: TokensRepository,
    ) {}

    public async getRefreshToken({
        token,
        userId,
        userAgent,
    }: {
        token: string | undefined;
        userId?: string;
        userAgent?: string;
    }): Promise<Token | null> {
        return this.tokensRepository.getRefreshToken({ token, userId, userAgent });
    }

    public async removeRefreshToken(refreshToken: string): Promise<Token> {
        return this.tokensRepository.removeRefreshToken(refreshToken);
    }

    public async generateTokens(id: string, email: string, userAgent: string): Promise<Tokens> {
        const accessToken = await this.jwtService.signAsync({ id, email });
        const refreshToken = await this.tokensRepository.getRefreshToken({
            token: undefined,
            userId: id,
            userAgent,
        });

        // todo: create upsert method in prisma. after, remove generateJsonForTokens method
        if (!refreshToken) {
            const newRefreshToken = await this.tokensRepository.createRefreshToken(id, userAgent);
            return this.generateJsonForTokens(accessToken, newRefreshToken);
        } else {
            const oldRefreshToken = await this.tokensRepository.updateRefreshToken(refreshToken.token);
            return this.generateJsonForTokens(accessToken, oldRefreshToken);
        }
    }

    private generateJsonForTokens(accessToken: string, refreshToken: Token): Tokens {
        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken,
        };
    }
}
