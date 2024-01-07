import {
    Get,
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
    NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { UserResponse } from '../../common/responses/user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    FAILED_UPDATE_USER,
    USER_DELETION_ERROR,
    USER_NOT_FOUND,
} from '../../common/constants/error-messages.constant';
import { ApiUserUpdate } from '../../swagger/decorators/api-user-update.decorator';
import { ApiRemoveUser } from '../../swagger/decorators/api-remove-user.decorator';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { File } from '../../common/types/file.type';
import { ApiGetCurrentUser } from '../../swagger/decorators/api-get-current-user.decorator';

@ApiBearerAuth()
@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @ApiGetCurrentUser()
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public async getCurrentUser(@User() user: JwtPayload): Promise<UserResponse> {
        const currentUser = await this.userProfileService.getCurrentUser(user.id);

        if (!currentUser) {
            throw new NotFoundException(USER_NOT_FOUND);
        }

        return new UserResponse(currentUser);
    }

    @ApiUserUpdate()
    @UsePipes(FileValidationPipe)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
    @Patch('update')
    public async update(
        @User() user: JwtPayload,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile() file?: File,
    ): Promise<UserResponse> {
        // todo-log: remove
        console.log(file);
        console.log('typeof file', typeof file);
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
