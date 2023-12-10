import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserProfileService } from '../user-profile.service';
import { UserService } from '../../user/user.service';
import { UserRepository } from '../../user/user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BODY_IS_EMPTY, FAILED_LOAD_AVATAR } from '../../../common/constants/error-messages.constant';
import {
    mockUserService,
    updateUserDto,
    user,
    userId,
    file,
    mockCloudinaryService,
    cloudinaryResponse,
} from './mocks/user-profile.service.mock';
import { CloudinaryService } from '../../../models/cloudinary/cloudinary.service';
import type { File } from '../../../common/types/file.type';
import type { UpdateUserFields } from '../../../common/types/configuration-user.type';

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
                { provide: CloudinaryService, useValue: mockCloudinaryService },
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        userProfileService = moduleRef.get<UserProfileService>(UserProfileService);
    });

    describe('getCurrentUser', () => {
        it('should call userService.findOneById with userId', async () => {
            mockUserService.findOneById.mockImplementation(() => user);

            await userProfileService.getCurrentUser(userId);

            expect(mockUserService.findOneById).toHaveBeenCalledWith(userId);
        });
    });

    describe('update', () => {
        it('should throw BadRequestException if dto is empty', async () => {
            try {
                await userProfileService.update(userId, {}, file);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should call userService.update without avatarFile', async () => {
            await userProfileService.update(userId, updateUserDto);

            expect(mockUserService.update).toHaveBeenCalledWith(userId, updateUserDto);
        });

        it('should have correct message in BadRequestException if dto is empty', async () => {
            try {
                await userProfileService.update(userId, {}, {} as File);
            } catch (error) {
                expect(error.message).toBe(BODY_IS_EMPTY);
            }
        });

        it('should throw BadRequestException if avatar not created', async () => {
            mockCloudinaryService.uploadImage.mockImplementation(() => null);

            try {
                await userProfileService.update(userId, updateUserDto, file);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should have correct message in BadRequestException if avatar not created', async () => {
            mockCloudinaryService.uploadImage.mockImplementation(() => null);

            try {
                await userProfileService.update(userId, updateUserDto, file);
            } catch (error) {
                expect(error.message).toBe(FAILED_LOAD_AVATAR);
            }
        });

        it('should call userService.update with correct arguments', async () => {
            mockUserService.findOneById.mockImplementation(() => user);
            mockCloudinaryService.uploadImage.mockImplementation(() => cloudinaryResponse);

            await userProfileService.update(userId, updateUserDto, file);

            const updateFields: UpdateUserFields = {
                ...updateUserDto,
                avatarUrl: cloudinaryResponse.secure_url,
            };

            expect(mockUserService.update).toHaveBeenCalledWith(userId, updateFields);
        });
    });

    describe('remove', () => {
        it('should call userService.remove with userId', async () => {
            mockUserService.remove.mockImplementation(() => user);

            await userProfileService.remove(userId);

            expect(mockUserService.remove).toHaveBeenCalledWith(userId);
        });
    });
});
