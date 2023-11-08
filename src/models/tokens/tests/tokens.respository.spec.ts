import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../tokens.service';
import { TokensRepository } from '../tokens.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';

const libraryMock = {
    uuidV4: 'token',
    dateFnsAdd: new Date(),
}

jest.mock('uuid', () => ({
    v4: jest.fn(() => libraryMock.uuidV4)
}));
jest.mock('date-fns', () => ({
    add: jest.fn(() => libraryMock.dateFnsAdd)
}));

const mockPrismaService = {
    token: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
    },
};
const mockAuthenticationConfigService = {
    refreshTokenExpire: '30d',
};

describe('TokensRepository', () => {
    let tokensRepository: TokensRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                TokensService,
                TokensRepository,
                JwtService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: AuthenticationConfigService, useValue: mockAuthenticationConfigService },
            ],
        }).compile();

        tokensRepository = moduleRef.get<TokensRepository>(TokensRepository);
    });

    describe('getRefreshToken', () => {
        it('should call prismaService.token.findFirst with all arguments without problem', async () => {
            const userInfo = {
                token: 'token',
                userAgent: 'agent',
                userId: 'uuid-123',
            };
            const received = {
                where: userInfo,
            };

            await tokensRepository.getRefreshToken(userInfo);

            expect(mockPrismaService.token.findFirst).toHaveBeenCalledWith(received);
        });

        it('should return token', async () => {
            const token = {
                token: 'mock',
                expired: new Date(),
                userId: 'uuid-123',
                userAgent: 'agent',
            };

            mockPrismaService.token.findFirst.mockResolvedValueOnce(token);

            const refreshToken = await tokensRepository.getRefreshToken({
                token: 'mock',
                userAgent: 'agent',
                userId: 'uuid-123',
            });

            expect(refreshToken).toEqual(token);
        });

        it('should return null if prismaService.token.findFirst throw exception', async () => {
            mockPrismaService.token.findFirst.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const refreshToken = await tokensRepository.getRefreshToken({
                token: 'mock',
                userAgent: 'agent',
                userId: 'uuid-123',
            });

            expect(refreshToken).toBeNull();
        });
    });

    describe('upsertRefreshToken', () => {
        it('should return null if generateInfoForRefreshToken return null', async () => {
            const generateInfoForRefreshToken = jest.spyOn(tokensRepository as any, 'generateInfoForRefreshToken');

            generateInfoForRefreshToken.mockImplementation(jest.fn(() => null));

            const token = await tokensRepository.upsertRefreshToken('uuid-123', 'agent');

            expect(token).toBeNull();
        });

        it('should call prismaService.token.upsert with correct refresh token if refresh token founded in db', async () => {
            const userInfo = {
                id: 'uuid-123',
                agent: 'agent',
            };
            const token = {
                token: 'mock',
                expired: new Date(),
                userId: userInfo.id,
                userAgent: userInfo.agent,
            };
            const received = {
                where: {
                    token: token.token,
                },
                create: {
                    token: libraryMock.uuidV4,
                    expired: libraryMock.dateFnsAdd,
                    userId: userInfo.id,
                    userAgent: userInfo.agent,
                },
                update: {
                    token: libraryMock.uuidV4,
                    expired: libraryMock.dateFnsAdd,
                },
            };
            mockPrismaService.token.findFirst.mockResolvedValueOnce(token);

            await tokensRepository.upsertRefreshToken(userInfo.id, userInfo.agent);

            expect(mockPrismaService.token.upsert).toHaveBeenCalledWith(received);
        });

        it('should call prismaService.token.upsert with invalid refresh token if refreshToken not found in db', async () => {        
            const received = {
                where: {
                    token: '',
                },
                create: {
                    token: libraryMock.uuidV4,
                    expired: libraryMock.dateFnsAdd,
                    userId: 'uuid-123',
                    userAgent: 'agent',
                },
                update: {
                    token: libraryMock.uuidV4,
                    expired: libraryMock.dateFnsAdd,
                },
            };
            mockPrismaService.token.findFirst.mockResolvedValueOnce(null);

            await tokensRepository.upsertRefreshToken('uuid-123', 'agent');

            expect(mockPrismaService.token.upsert).toHaveBeenCalledWith(received);
        });

        it('should call getRefreshToken with userId and userAgent', async () => {
            const received = {
                userId: 'uuid-123',
                userAgent: 'agent',
            };
            const getRefreshToken = jest.spyOn(tokensRepository, 'getRefreshToken');

            await tokensRepository.upsertRefreshToken(received.userId, received.userAgent);

            expect(getRefreshToken).toHaveBeenCalledWith(received);
        });

        it('should call generateInfoForRefreshToken', async () => {
            const generateInfoForRefreshToken = jest.spyOn(tokensRepository as any, 'generateInfoForRefreshToken');

            await tokensRepository.upsertRefreshToken('uuid-123', 'agent');

            expect(generateInfoForRefreshToken).toHaveBeenCalled();
        });

        it('should return null if prismaService.token.upsert throw exception', async () => {
            const userInfo = {
                id: 'uuid-123',
                agent: 'agent',
            };
            const token = {
                token: 'mock',
                expired: new Date(),
                userId: userInfo.id,
                userAgent: userInfo.agent,
            };

            mockPrismaService.token.findFirst.mockResolvedValueOnce(token);
            mockPrismaService.token.upsert.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const result = await tokensRepository.upsertRefreshToken(userInfo.id, userInfo.agent);

            expect(result).toBeNull();
        });
    });

    describe('removeRefreshToken', () => {
        it('should call prismaService.token.delete with refresh token without problem', async () => {
            const refreshToken = 'mock-token';
            const received = {
                where: {
                    token: refreshToken
                },
            };

            await tokensRepository.removeRefreshToken(refreshToken);

            expect(mockPrismaService.token.delete).toHaveBeenCalledWith(received);
        });

        it('should return token after delete', async () => {
            const token = {
                token: 'mock-token',
                expired: new Date(),
                userId: 'uuid-123',
                userAgent: 'agent',
            };

            mockPrismaService.token.delete.mockResolvedValueOnce(token);

            const refreshToken = await tokensRepository.removeRefreshToken(token.token);

            expect(refreshToken).toEqual(token);
        });

        it('should return null if prismaService.token.delete throw exception', async () => {
            mockPrismaService.token.delete.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const refreshToken = await tokensRepository.removeRefreshToken('mock-token');

            expect(refreshToken).toBeNull();
        });
    });
});
