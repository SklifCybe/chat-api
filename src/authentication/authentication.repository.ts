import { v4 } from 'uuid';
import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import type { Token } from '@prisma/client';
import { PrismaService } from '../models/prisma/prisma.service';

@Injectable()
export class AuthenticationRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async createRefreshToken(userId: string, userAgent: string): Promise<Token> {
        const { token, expired } = this.generateInfoForRefreshToken();

        return this.prismaService.token.create({
            data: {
                token,
                expired,
                userId,
                userAgent,
            },
        });
    }

    public async updateRefreshToken(token: string): Promise<Token> {
        const newData = this.generateInfoForRefreshToken();

        return this.prismaService.token.update({ where: { token }, data: newData });
    }

    public async getRefreshToken({
        token,
        userId,
        userAgent,
    }: {
        token: string | undefined;
        userId?: string;
        userAgent?: string;
    }): Promise<Token | null> {
        return this.prismaService.token.findFirst({ where: { token, userId, userAgent } });
    }

    public async removeRefreshToken(refreshToken: string): Promise<Token> {
        return this.prismaService.token.delete({ where: { token: refreshToken } });
    }

    private generateInfoForRefreshToken(): { token: string; expired: Date } {
        return {
            token: v4(),
            // todo: expired should be .env file
            expired: add(new Date(), { months: 1 }),
        };
    }
}
