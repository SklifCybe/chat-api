import {
    Controller,
    Patch,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    Body,
    BadRequestException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { UserResponse } from '../../common/responses/user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { FAILED_UPDATE_USER, USER_DELETION_ERROR } from '../../common/constants/error-messages.constant';
import { ApiResponseUserUpdate } from '../../swagger/decorators/api-response-user-update.decorator';
import { ApiResponseRemoveUser } from '../../swagger/decorators/api-response-remove-user.decorator';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/interfaces/jwt.interface';

@ApiBearerAuth()
@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @ApiResponseUserUpdate()
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('update')
    public async update(
        @User() user: JwtPayload,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponse> {
        const updatedUser = await this.userProfileService.update(user.id, updateUserDto);

        if (!updatedUser) {
            throw new BadRequestException(FAILED_UPDATE_USER);
        }

        return new UserResponse(updatedUser);
    }

    @ApiResponseRemoveUser()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    public async remove(@User() user: JwtPayload): Promise<void> {
        const removedUser = await this.userProfileService.remove(user.id);

        if (!removedUser) {
            throw new BadRequestException(USER_DELETION_ERROR);
        }
    }
}
