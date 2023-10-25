import { Test } from '@nestjs/testing';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { ConfigModule } from '@nestjs/config';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import { PrismaService } from '../../../models/prisma/prisma.service';
import {
    mockCacheManagerService,
    mockPrismaService,
    mockUserConfirmed,
    mockUserArguments,
    mockUserCreated,
} from './mocks/user.repository.mock';

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CacheManagerModule, RedisProviderModule, ConfigModule.forRoot({ isGlobal: true })],
            providers: [
                UserService,
                UserRepository,
                AuthenticationConfigService,
                { provide: CacheManagerService, useValue: mockCacheManagerService },
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        userRepository = moduleRef.get<UserRepository>(UserRepository);
    });

    describe('create', () => {
        it('should create user', async () => {
            mockPrismaService.user.create.mockResolvedValue(mockUserCreated);
            const { email, firstName, lastName, password } = mockUserArguments.data;
            const user = await userRepository.create(firstName, lastName, email, password);

            expect(user).toEqual(mockUserCreated);
        });

        it('should be null if prisma throw exception', async () => {
            jest.spyOn(mockPrismaService.user, 'create').mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );
            const { email, firstName, lastName, password } = mockUserArguments.data;
            const user = await userRepository.create(firstName, lastName, email, password);

            expect(user).toBeNull();
        });

        it('should call create function with correct arguments', async () => {
            const { email, firstName, lastName, password } = mockUserArguments.data;

            await userRepository.create(firstName, lastName, email, password);

            expect(mockPrismaService.user.create).toHaveBeenCalledWith(mockUserArguments);
        });
    });

    describe('findOne', () => {
        it('should return user from cache', async () => {
            mockCacheManagerService.get.mockImplementation(() => mockUserCreated);

            const user = await userRepository.findOne(mockUserCreated.id);

            expect(user).toEqual(mockUserCreated);
        });

        it('should call get method from cache with correct arguments', async () => {
            await userRepository.findOne(mockUserCreated.id);

            expect(mockCacheManagerService.get).toHaveBeenCalledWith(mockUserCreated.id);
        });

        it('should found user in database', async () => {
            mockPrismaService.user.findFirst.mockImplementation(() => mockUserCreated);

            const user = await userRepository.findOne(mockUserCreated.id);

            expect(user).toEqual(mockUserCreated);
        });

        it('should call findFirst method with correct arguments', async () => {
            mockCacheManagerService.get.mockImplementation(() => null);

            const received = {
                where: { OR: [{ id: mockUserCreated.id }, { email: mockUserCreated.id }] },
            };

            await userRepository.findOne(mockUserCreated.id);

            expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith(received);
        });

        it('should call set method from cache with correct arguments', async () => {
            mockCacheManagerService.get.mockImplementation(() => null);

            await userRepository.findOne(mockUserCreated.id);

            expect(mockCacheManagerService.set).toHaveBeenCalledWith(mockUserCreated.id, mockUserCreated);
        });

        it('should return null if prisma throw exception', async () => {
            mockCacheManagerService.get.mockImplementation(() => null);
            jest.spyOn(mockPrismaService.user, 'findFirst').mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const user = await userRepository.findOne(mockUserCreated.id);

            expect(user).toBeNull();
        });
    });

    describe('remove', () => {
        it('should call delete method with correct arguments', async () => {
            await userRepository.remove(mockUserCreated.id);

            const received = { where: { id: mockUserCreated.id } };

            expect(mockPrismaService.user.delete).toHaveBeenCalledWith(received);
        });

        it('should return user if user was deleted', async () => {
            mockPrismaService.user.delete.mockImplementation(() => mockUserCreated);

            const user = await userRepository.remove(mockUserCreated.id);

            expect(user).toEqual(mockUserCreated);
        });

        it('should return null if prisma throw exception', async () => {
            mockPrismaService.user.delete.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const user = await userRepository.remove(mockUserCreated.id);

            expect(user).toBeNull();
        });

        it('should call del methods with user id', async () => {
            await userRepository.remove(mockUserCreated.id);

            expect(mockCacheManagerService.del).toHaveBeenCalledWith(mockUserCreated.id);
        });

        it('should call del methods with user email', async () => {
            await userRepository.remove(mockUserCreated.email);

            expect(mockCacheManagerService.del).toHaveBeenCalledWith(mockUserCreated.email);
        });
    });

    describe('confirm', () => {
        it('should return user if user was updated', async () => {
            mockPrismaService.user.update.mockImplementation(() => mockUserConfirmed);

            const user = await userRepository.confirm(mockUserCreated.id);

            expect(user).toEqual(mockUserConfirmed);
        });

        it('should call update method with correct arguments', async () => {
            await userRepository.confirm(mockUserCreated.email);

            const received = { where: { id: mockUserCreated.id }, data: { mailConfirmed: true } };

            expect(mockPrismaService.user.update).toHaveBeenCalledWith(received);
        });

        it('should return null if prisma throw exception', async () => {
            mockPrismaService.user.update.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const user = await userRepository.confirm(mockUserConfirmed.id);

            expect(user).toBeNull();
        });
    });
});