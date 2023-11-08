import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../tokens.service';
import { TokensRepository } from '../tokens.repository';
import type { Token } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { FAILED_CREATE_TOKENS } from '../../../common/constants/error-messages.constant';

const mockTokensRepository = {
    getRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
    upsertRefreshToken: jest.fn(),
};
const mockJwtService = {
    signAsync: jest.fn(),
};
const mockToken: Token = {
    token: 'mock',
    expired: new Date(),
    userId: 'mock',
    userAgent: 'mock',
};

describe('TokensService', () => {
    let tokensService: TokensService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                TokensService,
                { provide: JwtService, useValue: mockJwtService },
                { provide: TokensRepository, useValue: mockTokensRepository },
            ],
        }).compile();

        tokensService = moduleRef.get<TokensService>(TokensService);
    });

    describe('getRefreshToken', () => {
        it('should return token without problem', async () => {
            mockTokensRepository.getRefreshToken.mockResolvedValue(mockToken);

            const parameters = {
                token: 'mock',
                userId: 'mock',
                userAgent: 'mock',
            };

            const token = await tokensService.getRefreshToken(parameters);

            expect(token).toEqual(mockToken);
        });

        it('should call mockTokensRepository.getRefreshToken with all arguments', async () => {
            mockTokensRepository.getRefreshToken.mockResolvedValue(mockToken);

            const parameters = {
                token: 'mock',
                userId: 'mock',
                userAgent: 'mock',
            };

            await tokensService.getRefreshToken(parameters);

            expect(mockTokensRepository.getRefreshToken).toHaveBeenCalledWith(parameters);
        });

        it('should call with empty arguments', async () => {
            await tokensService.getRefreshToken({});

            expect(mockTokensRepository.getRefreshToken).toHaveBeenCalledWith({});
        });
    });

    describe('removeRefreshToken', () => {
        it('should call tokensRepository.removeRefreshToken with correct refreshToken', async () => {
            const refreshToken = 'refreshToken-123';

            await tokensService.removeRefreshToken(refreshToken);

            expect(mockTokensRepository.removeRefreshToken).toHaveBeenCalledWith(refreshToken);
        });
    });

    describe('generateTokens', () => {
        it('should throw UnauthorizedException if jwtService not created access token', async () => {
            mockJwtService.signAsync.mockImplementation(
                jest.fn(() => {
                    new Error();
                }),
            );

            try {
                await tokensService.generateTokens('uuid-123', 'test@gmail.com', 'mock');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
            }
        });

        it('should throw UnauthorizedException with correct message if not created access token', async () => {
            mockJwtService.signAsync.mockImplementation(
                jest.fn(() => {
                    new Error();
                }),
            );

            try {
                await tokensService.generateTokens('uuid-123', 'test@gmail.com', 'mock');
            } catch (error) {
                expect(error.message).toBe(FAILED_CREATE_TOKENS);
            }
        });

        it('should call jwtService.signAsync with id and email arguments', async () => {
            const userInfo = {
                id: 'uuid-123',
                email: 'test@gmail.com',
            };

            mockJwtService.signAsync.mockResolvedValue('mock-access-token');
            mockTokensRepository.upsertRefreshToken.mockResolvedValue({
                token: 'mock',
                expired: new Date(),
                userId: userInfo.id,
                userAgent: 'agent',
            });

            await tokensService.generateTokens(userInfo.id, userInfo.email, 'mock');

            expect(mockJwtService.signAsync).toHaveBeenCalledWith(userInfo);
        });

        it('should call tokensRepository.upsertRefreshToken with userId and userAgent arguments', async () => {
            const userInfo = {
                id: 'uuid-123',
                agent: 'agent',
            };

            mockJwtService.signAsync.mockResolvedValue('mock-access-token');
            mockTokensRepository.upsertRefreshToken.mockResolvedValue({
                token: 'mock',
                expired: new Date(),
                userId: userInfo.id,
                userAgent: userInfo.agent,
            });

            await tokensService.generateTokens(userInfo.id, 'test@gmail.com', userInfo.agent);

            expect(mockTokensRepository.upsertRefreshToken).toHaveBeenCalledWith(userInfo.id, userInfo.agent);
        });

        it('should throw UnauthorizedException if refreshToken not created', async () => {
            mockTokensRepository.upsertRefreshToken.mockImplementation(
                jest.fn(() => {
                    new Error();
                }),
            );

            try {
                await tokensService.generateTokens('uuid-123', 'test@gmail.com', 'mock');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
            }
        });

        it('should throw UnauthorizedException with correct message if not created refresh token', async () => {
            mockTokensRepository.upsertRefreshToken.mockImplementation(
                jest.fn(() => {
                    new Error();
                }),
            );

            try {
                await tokensService.generateTokens('uuid-123', 'test@gmail.com', 'mock');
            } catch (error) {
                expect(error.message).toBe(FAILED_CREATE_TOKENS);
            }
        });

        it('should return tokens if they are created', async () => {
            const accessToken = 'mock-access-token';
            const refreshToken = {
                token: 'mock',
                expired: new Date(),
                userId: 'uuid-123',
                userAgent: 'agent',
            };
            const received = {
                accessToken: `Bearer ${accessToken}`,
                refreshToken,
            }

            mockJwtService.signAsync.mockResolvedValue(accessToken);
            mockTokensRepository.upsertRefreshToken.mockResolvedValue(refreshToken);

            const tokens = await tokensService.generateTokens('uuid-123', 'test@gmail.com', 'agent');

            expect(tokens).toEqual(received);
        });
    });
});
