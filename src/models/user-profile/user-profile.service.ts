import type { User } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from '../user/user.service';
import { BODY_IS_EMPTY, FAILED_LOAD_AVATAR } from '../../common/constants/error-messages.constant';
import { isEmptyObject } from '../../common/utils/is-empty-object';
import type { File } from '../../common/types/file.type';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import type { UpdateUserFields } from '../../common/types/configuration-user.type';

@Injectable()
export class UserProfileService {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    public async getCurrentUser(userId: string): Promise<User | null> {
        return this.userService.findOneById(userId);
    }

    public async update(id: string, updateUserDto: UpdateUserDto, avatarFile?: File): Promise<User | null> {
        if (isEmptyObject(updateUserDto, avatarFile)) {
            throw new BadRequestException(BODY_IS_EMPTY);
        }

        if (!avatarFile) {
            return this.userService.update(id, updateUserDto);
        }

        const avatarImage = await this.cloudinaryService.uploadImage(avatarFile);

        if (!avatarImage) {
            throw new BadRequestException(FAILED_LOAD_AVATAR);
        }

        const updateFields: UpdateUserFields = {
            ...updateUserDto,
            avatarUrl: avatarImage.secure_url,
        };

        return this.userService.update(id, updateFields);
    }

    public async remove(id: string): Promise<User | null> {
        return this.userService.remove(id);
    }
}
