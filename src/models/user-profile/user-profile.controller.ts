import {
    Controller,
    Patch,
    UseInterceptors,
    ClassSerializerInterceptor,
    Param,
    Body,
    ParseUUIDPipe,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { UserResponse } from '../../common/responses/user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { FAILED_UPDATE_USER } from '../../common/constants/error-messages.constant';
import { ApiResponseUserUpdate } from '../../swagger/decorators/api-response-user-update.decorator';

@ApiBearerAuth()
@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @ApiResponseUserUpdate()
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('update/:id')
    public async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponse> {
        const user = await this.userProfileService.update(id, updateUserDto);

        if (!user) {
            throw new BadRequestException(FAILED_UPDATE_USER);
        }

        return new UserResponse(user);
    }
}
