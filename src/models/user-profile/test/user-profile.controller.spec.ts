import { BadRequestException, NotFoundException } from '@nestjs/common';
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
import { FAILED_UPDATE_USER, USER_DELETION_ERROR, USER_NOT_FOUND } from '../../../common/constants/error-messages.constant';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import {
    mockUserProfileService,
    updateUserDto,
    user,
    userId,
    jwtPayload,
    file,
} from './mocks/user-profile.controller.mock';
import { CloudinaryConfigModule } from '../../../config/cloudinary/config.module';

describe('UserProfileController', () => {
    let userProfileController: UserProfileController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CacheManagerModule, RedisProviderModule, ConfigModule.forRoot({ isGlobal: true }), CloudinaryConfigModule],
            controllers: [UserProfileController],
            providers: [
                UserService,
                CacheManagerService,
                AuthenticationConfigService,
                UserRepository,
                PrismaService,
                CloudinaryService,
                { provide: UserProfileService, useValue: mockUserProfileService },
            ],
        }).compile();

        userProfileController = moduleRef.get<UserProfileController>(UserProfileController);
    });

    describe('getCurrentUser', () => {
        it('should call getCurrentUser method with userId', async () => {
            mockUserProfileService.getCurrentUser.mockImplementation(() => user);

            await userProfileController.getCurrentUser(jwtPayload);

            expect(mockUserProfileService.getCurrentUser).toHaveBeenCalledWith(jwtPayload.id);
        });

        it('should throw NotFoundException if user not found', async () => {
            mockUserProfileService.getCurrentUser.mockImplementation(() => null);

            try {
                await userProfileController.getCurrentUser(jwtPayload);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('should return user instance of UserResponse', async () => {
            mockUserProfileService.getCurrentUser.mockImplementation(() => user);

            const currentUser = await userProfileController.getCurrentUser(jwtPayload);

            expect(currentUser).toBeInstanceOf(UserResponse);
        });

        it('should have correct error message if user not found', async () => {
            mockUserProfileService.getCurrentUser.mockImplementation(() => null);

            try {
                await userProfileController.getCurrentUser(jwtPayload);
            } catch (error) {
                expect(error.message).toBe(USER_NOT_FOUND);
            }
        });
    });

    describe('update', () => {
        it('should call userProfileService.update with correct arguments', async () => {
            mockUserProfileService.update.mockImplementation(() => user);

            await userProfileController.update(jwtPayload, updateUserDto, file);
            // todo: change to toHaveBeenCalledWith
            expect(mockUserProfileService.update).toHaveBeenCalledWith(userId, updateUserDto, file);
        });

        it('should return user instance of UserResponse', async () => {
            mockUserProfileService.update.mockImplementation(() => user);

            const updatedUser = await userProfileController.update(jwtPayload, updateUserDto, file);

            expect(updatedUser).toBeInstanceOf(UserResponse);
        });

        it('should throw BadRequestException if user not updated', async () => {
            mockUserProfileService.update.mockImplementation(() => null);

            try {
                await userProfileController.update(jwtPayload, updateUserDto, file);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should have correct error message if user not updated', async () => {
            mockUserProfileService.update.mockImplementation(() => null);

            try {
                await userProfileController.update(jwtPayload, updateUserDto, file);
            } catch (error) {
                expect(error.message).toBe(FAILED_UPDATE_USER);
            }
        });
    });

    describe('remove', () => {
        it('should call userProfileService.remove with correct arguments', async () => {
            mockUserProfileService.remove.mockImplementation(() => user);

            await userProfileController.remove(jwtPayload);

            expect(mockUserProfileService.remove).toHaveBeenLastCalledWith(jwtPayload.id);
        });

        it('should return void', async () => {
            mockUserProfileService.remove.mockImplementation(() => user);

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
