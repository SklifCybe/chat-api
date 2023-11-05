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
    UploadedFile,
    UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { UserResponse } from '../../common/responses/user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { FAILED_UPDATE_USER, USER_DELETION_ERROR } from '../../common/constants/error-messages.constant';
import { ApiUserUpdate } from '../../swagger/decorators/api-user-update.decorator';
import { ApiRemoveUser } from '../../swagger/decorators/api-remove-user.decorator';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { File } from '../../common/types/file.type';

@ApiBearerAuth()
@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @ApiUserUpdate()
    @UsePipes(FileValidationPipe)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
    @Patch('update')
    public async update(
        @User() user: JwtPayload,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile() file: File,
    ): Promise<UserResponse> {
        const updatedUser = await this.userProfileService.update(user.id, updateUserDto, file);

        if (!updatedUser) {
            throw new BadRequestException(FAILED_UPDATE_USER);
        }

        return new UserResponse(updatedUser);
    }

    @ApiRemoveUser()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    public async remove(@User() user: JwtPayload): Promise<void> {
        const removedUser = await this.userProfileService.remove(user.id);

        if (!removedUser) {
            throw new BadRequestException(USER_DELETION_ERROR);
        }
    }
}
