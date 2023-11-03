import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserProfileService } from '../user-profile.service';
import { UserService } from '../../user/user.service';
import { UserRepository } from '../../user/user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BODY_IS_EMPTY, USER_NOT_FOUND } from '../../../common/constants/error-messages.constant';
import { mockUserService, updateUserDto, updatedUser, userId } from './mocks/user-profile.service.mock';
import type { UpdateUserDto } from '../dto/update-user.dto';

describe('UserProfileService', () => {
    let userProfileService: UserProfileService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CacheManagerModule, RedisProviderModule, ConfigModule.forRoot({ isGlobal: true })],
            providers: [
                CacheManagerService,
                AuthenticationConfigService,
                UserRepository,
                PrismaService,
                UserProfileService,
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        userProfileService = moduleRef.get<UserProfileService>(UserProfileService);
    });

    describe('update', () => {
        it('should throw BadRequestException if dto is empty', async () => {
            try {
                await userProfileService.update(userId, {} as UpdateUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should have correct message in BadRequestException if dto is empty', async () => {
            try {
                await userProfileService.update(userId, {} as UpdateUserDto);
            } catch (error) {
                expect(error.message).toBe(BODY_IS_EMPTY);
            }
        });

        it('should call userService.findOneById with userId', async () => {
            mockUserService.findOneById.mockImplementation(() => updatedUser);

            await userProfileService.update(userId, updateUserDto);

            expect(mockUserService.findOneById).toHaveBeenCalledWith(userId);
        });

        it('should throw NotFoundException if user not found', async () => {
            mockUserService.findOneById.mockImplementation(() => null);

            try {
                await userProfileService.update(userId, updateUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('should have correct message in BadRequestException if dto is empty', async () => {
            mockUserService.findOneById.mockImplementation(() => null);

            try {
                await userProfileService.update(userId, updateUserDto);
            } catch (error) {
                expect(error.message).toBe(USER_NOT_FOUND);
            }
        });

        it('should call userService.update with correct arguments', async () => {
            mockUserService.findOneById.mockImplementation(() => updatedUser);

            await userProfileService.update(userId, updateUserDto);

            expect(mockUserService.update).toHaveBeenCalledWith(userId, updateUserDto);
        });
    });

    describe('remove', () => {
        it('should call userService.remove with userId', async () => {
            mockUserService.remove.mockImplementation(() => updatedUser);

            await userProfileService.remove(userId);

            expect(mockUserService.remove).toHaveBeenCalledWith(userId);
        });
    });
});
