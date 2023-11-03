import type { User } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from '../user/user.service';
import { USER_NOT_FOUND, BODY_IS_EMPTY } from '../../common/constants/error-messages.constant';
import { isEmptyObject } from '../../common/utils/is-empty-object';

@Injectable()
export class UserProfileService {
    constructor(private readonly userService: UserService) {}
    
    public async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        if (isEmptyObject(updateUserDto)) {
            throw new BadRequestException(BODY_IS_EMPTY);
        }

        const user = await this.userService.findOneById(id);

        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND);
        }

        return this.userService.update(id, updateUserDto);
    }

    public async remove(id: string): Promise<User | null> {
        return this.userService.remove(id);
    }
}
