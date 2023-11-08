import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensRepository } from './tokens.repository';
import type { Token } from '@prisma/client';
import type { Tokens } from '../../common/types/tokens.type';
import { FAILED_CREATE_TOKENS } from '../../common/constants/error-messages.constant';

@Injectable()
export class TokensService {
    private readonly logger = new Logger();

    constructor(
        private readonly jwtService: JwtService,
        private readonly tokensRepository: TokensRepository,
    ) {}

    public async getRefreshToken({
        token,
        userId,
        userAgent,
    }: {
        token?: string;
        userId?: string;
        userAgent?: string;
    }): Promise<Token | null> {
        return this.tokensRepository.getRefreshToken({ token, userId, userAgent });
    }

    public async removeRefreshToken(refreshToken: string): Promise<Token | null> {
        return this.tokensRepository.removeRefreshToken(refreshToken);
    }

    public async generateTokens(userId: string, email: string, userAgent: string): Promise<Tokens> {
        const accessToken = await this.getAccessTokenWithBearer(userId, email);

        if (!accessToken) {
            throw new UnauthorizedException(FAILED_CREATE_TOKENS);
        }

        const refreshToken = await this.tokensRepository.upsertRefreshToken(userId, userAgent);

        if (!refreshToken) {
            throw new UnauthorizedException(FAILED_CREATE_TOKENS);
        }

        return { accessToken, refreshToken };
    }

    private async getAccessTokenWithBearer(id: string, email: string): Promise<string | null> {
        try {
            const accessToken = await this.jwtService.signAsync({ id, email });

            return `Bearer ${accessToken}`;
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
