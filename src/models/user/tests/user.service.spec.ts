import { Test } from '@nestjs/testing';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { ConfigModule } from '@nestjs/config';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import {
    mockSignUpDto,
    mockUserReturn,
    hashedPassword,
    salt,
    mockUserRepository,
    mockCloudinaryService,
    id,
    mockUserUpdateFields,
    mockUpdateFieldsWithPassword,
} from './mocks/user.service.mock';
import type { UpdateUserFields } from '../../../common/types/configuration-user.type';
import type { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { Order } from '../../../common/constants/order.constant';
import { UserSearchBy } from '../../../common/constants/user-search-by.constant';
import type { User } from '@prisma/client';
import type { PageMetaDto } from '../../../common/dtos/page-meta-dto';
import { BadRequestException } from '@nestjs/common';
import { CloudinaryModule } from '../../../models/cloudinary/cloudinary.module';
import { CloudinaryService } from '../../../models/cloudinary/cloudinary.service';

jest.mock('bcrypt', () => ({
    hash: jest.fn(() => hashedPassword),
    genSalt: jest.fn(() => salt),
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CacheManagerModule, RedisProviderModule, ConfigModule.forRoot({ isGlobal: true }), CloudinaryModule],
            providers: [
                UserService,
                CacheManagerService,
                AuthenticationConfigService,
                { provide: CloudinaryService, useValue: mockCloudinaryService },
                { provide: UserRepository, useValue: mockUserRepository },
            ],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
    });

    describe('getAll', () => {
        it('should return data and meta on success', async () => {
            const pageOptionsDto: PageOptionsDto = {
                limit: 10,
                orderBy: Order.Asc,
                page: 1,
                searchBy: UserSearchBy.Email,
                searchText: '@gmail.com',
            };
            const mockUsers: User[] = [
                {
                    avatarUrl: 'http://avatar.png',
                    createdAt: new Date(),
                    email: 'test@gmail.com',
                    firstName: 'Ilya',
                    lastName: 'Strelkovskiy',
                    id: 'id',
                    mailConfirmed: true,
                    password: 'password',
                    updatedAt: new Date(),
                    userName: 'sklif',
                },
            ];
            const mockTotal = 1;
            const received: [User[], PageMetaDto] = [
                mockUsers,
                {
                    limit: pageOptionsDto.limit,
                    offset: 0,
                    page: pageOptionsDto.page,
                    total: mockTotal,
                },
            ];

            mockUserRepository.findMany.mockResolvedValueOnce(mockUsers);
            mockUserRepository.count.mockResolvedValueOnce(mockTotal);

            const result = await userService.getAll(pageOptionsDto);

            expect(result).toEqual(received);
        });

        it('should throw BadRequestException if findMany return null', async () => {
            const pageOptionsDto: PageOptionsDto = {
                limit: 10,
                orderBy: Order.Asc,
                page: 1,
                searchBy: UserSearchBy.Email,
                searchText: '@gmail.com',
            };
            const mockTotal = 1;

            mockUserRepository.findMany.mockResolvedValueOnce(null);
            mockUserRepository.count.mockResolvedValueOnce(mockTotal);

            try {
                await userService.getAll(pageOptionsDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw BadRequestException if count return null', async () => {
            const pageOptionsDto: PageOptionsDto = {
                limit: 10,
                orderBy: Order.Asc,
                page: 1,
                searchBy: UserSearchBy.Email,
                searchText: '@gmail.com',
            };
            const mockUsers: User[] = [
                {
                    avatarUrl: 'http://avatar.png',
                    createdAt: new Date(),
                    email: 'test@gmail.com',
                    firstName: 'Ilya',
                    lastName: 'Strelkovskiy',
                    id: 'id',
                    mailConfirmed: true,
                    password: 'password',
                    updatedAt: new Date(),
                    userName: 'sklif',
                },
            ];

            mockUserRepository.findMany.mockResolvedValueOnce(mockUsers);
            mockUserRepository.count.mockResolvedValueOnce(null);

            try {
                await userService.getAll(pageOptionsDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw BadRequestException if findMany and count return null', async () => {
            const pageOptionsDto: PageOptionsDto = {
                limit: 10,
                orderBy: Order.Asc,
                page: 1,
                searchBy: UserSearchBy.Email,
                searchText: '@gmail.com',
            };

            mockUserRepository.findMany.mockResolvedValueOnce(null);
            mockUserRepository.count.mockResolvedValueOnce(null);

            try {
                await userService.getAll(pageOptionsDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });
    });

    describe('create', () => {
        mockUserRepository.create.mockResolvedValue(mockUserReturn);
        mockCloudinaryService.getDefaultAvatarUrl.mockResolvedValue(mockUserReturn.avatarUrl);

        it('should return user', async () => {
            const user = await userService.create(mockSignUpDto);

            expect(user).toEqual(mockUserReturn);
        });

        it('method hashPassword should be called with password from dto', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');

            await userService.create(mockSignUpDto);

            expect(hashPassword).toHaveBeenCalledWith(mockSignUpDto.password);
        });

        it('method create from userRepository should be called with correct arguments', async () => {
            const { firstName, lastName, userName, email } = mockSignUpDto;
            const { password: hashedPassword, avatarUrl } = mockUserReturn;
            
            await userService.create(mockSignUpDto);

            expect(mockUserRepository.create).toHaveBeenCalledWith(
                firstName,
                lastName,
                userName,
                email,
                hashedPassword,
                avatarUrl
            );
        });

        it('should return null if hashPassword return null', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            hashPassword.mockImplementation(() => null);

            const user = await userService.create(mockSignUpDto);

            expect(user).toBeNull();
        });
    });

    describe('update', () => {
        it('should call userRepository.update without hashed password without problem', async () => {
            await userService.update(id, mockUserUpdateFields);

            expect(mockUserRepository.update).toHaveBeenCalledWith(id, mockUserUpdateFields);
        });

        it('should call userRepository.update with hashed password without problem', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            const received = {
                ...mockUpdateFieldsWithPassword,
                password: hashedPassword,
            };

            hashPassword.mockImplementation(() => hashedPassword);

            await userService.update(id, mockUpdateFieldsWithPassword);

            expect(mockUserRepository.update).toHaveBeenCalledWith(id, received);
        });

        it('should return null because hashPassword throw exception', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            const updateFields: UpdateUserFields = {
                ...mockUpdateFieldsWithPassword,
                password: hashedPassword,
            };

            hashPassword.mockImplementation(() => null);

            const user = await userService.update(id, updateFields);

            expect(user).toBeNull();
        });
    });

    it('findOneById should call findOne method with correct id', async () => {
        const { id } = mockUserReturn;

        await userService.findOneById(id);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('findOneByEmail should call findOne method with correct email', async () => {
        const { email } = mockUserReturn;

        await userService.findOneByEmail(email);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith(email);
    });

    it('remove should call remove method with correct id', async () => {
        const { id } = mockUserReturn;

        await userService.remove(id);

        expect(mockUserRepository.remove).toHaveBeenCalledWith(id);
    });

    it('confirm should call confirm method with correct id', async () => {
        const { id } = mockUserReturn;

        await userService.confirm(id);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith(id);
    });
});
