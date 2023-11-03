import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserProfileController } from '../user-profile.controller';
import { UserProfileService } from '../user-profile.service';
import { UserService } from '../../user/user.service';
import { UserRepository } from '../../user/user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponse } from '../../../common/responses/user.response';
import { FAILED_UPDATE_USER, USER_DELETION_ERROR } from '../../../common/constants/error-messages.constant';
import {
    mockUserProfileService,
    updateUserDto,
    updatedUser,
    userId,
    jwtPayload,
} from './mocks/user-profile.controller.mock';

describe('UserProfileController', () => {
    let userProfileController: UserProfileController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CacheManagerModule, RedisProviderModule, ConfigModule.forRoot({ isGlobal: true })],
            controllers: [UserProfileController],
            providers: [
                UserService,
                CacheManagerService,
                AuthenticationConfigService,
                UserRepository,
                PrismaService,
                { provide: UserProfileService, useValue: mockUserProfileService },
            ],
        }).compile();

        userProfileController = moduleRef.get<UserProfileController>(UserProfileController);
    });

    describe('update', () => {
        it('should call userProfileService.update with correct arguments', async () => {
            mockUserProfileService.update.mockImplementation(() => updatedUser);

            await userProfileController.update(jwtPayload, updateUserDto);

            expect(mockUserProfileService.update).toHaveBeenLastCalledWith(userId, updateUserDto);
        });

        it('should return user instance of UserResponse', async () => {
            mockUserProfileService.update.mockImplementation(() => updatedUser);

            const user = await userProfileController.update(jwtPayload, updateUserDto);

            expect(user).toBeInstanceOf(UserResponse);
        });

        it('should throw BadRequestException if user not updated', async () => {
            mockUserProfileService.update.mockImplementation(() => null);

            try {
                await userProfileController.update(jwtPayload, updateUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should have correct error message if user not updated', async () => {
            mockUserProfileService.update.mockImplementation(() => null);

            try {
                await userProfileController.update(jwtPayload, updateUserDto);
            } catch (error) {
                expect(error.message).toBe(FAILED_UPDATE_USER);
            }
        });
    });

    describe('remove', () => {
        it('should call userProfileService.remove with correct arguments', async () => {
            mockUserProfileService.remove.mockImplementation(() => updatedUser);

            await userProfileController.remove(jwtPayload);

            expect(mockUserProfileService.remove).toHaveBeenLastCalledWith(jwtPayload.id);
        });

        it('should return void', async () => {
            mockUserProfileService.remove.mockImplementation(() => updatedUser);

            const result = await userProfileController.remove(jwtPayload);

            expect(result).toBeUndefined();
        });

        it('should throw BadRequestException if user not removed', async () => {
            mockUserProfileService.remove.mockImplementation(() => null);

            try {
                await userProfileController.remove(jwtPayload);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should have correct error message if user not removed', async () => {
            mockUserProfileService.remove.mockImplementation(() => null);

            try {
                await userProfileController.remove(jwtPayload);
            } catch (error) {
                expect(error.message).toBe(USER_DELETION_ERROR);
            }
        });
    });
});
