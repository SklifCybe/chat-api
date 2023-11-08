import { Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';
import type { Token } from '@prisma/client';
import { add } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticationConfigService } from '../../config/authentication/config.service';
import { parseTimeDuration } from '../../common/utils/parse-time-duration';

@Injectable()
export class TokensRepository {
    private readonly logger = new Logger();

    constructor(
        private readonly prismaService: PrismaService,
        private readonly authenticationConfigService: AuthenticationConfigService,
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
        try {
            return await this.prismaService.token.findFirst({ where: { token, userId, userAgent } });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async upsertRefreshToken(userId: string, userAgent: string): Promise<Token | null> {
        try {
            const refreshToken = await this.getRefreshToken({ userId, userAgent });
            const tokenFields = this.generateInfoForRefreshToken();
            // needed for creation if the token is not in the database
            const INVALID_TOKEN = '';

            if (!tokenFields) {
                throw new Error();
            }

            return await this.prismaService.token.upsert({
                where: {
                    token: refreshToken?.token ?? INVALID_TOKEN,
                },
                create: {
                    ...tokenFields,
                    userId,
                    userAgent,
                },
                update: {
                    ...tokenFields,
                },
            });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async removeRefreshToken(refreshToken: string): Promise<Token | null> {
        try {
            return await this.prismaService.token.delete({ where: { token: refreshToken } });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    private generateInfoForRefreshToken(): { token: string; expired: Date } | null {
        try {
            const refreshTokenExpire = this.authenticationConfigService.refreshTokenExpire;
            const expiredDuration = parseTimeDuration(refreshTokenExpire);

            return {
                token: v4(),
                expired: add(new Date(), expiredDuration),
            };
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
