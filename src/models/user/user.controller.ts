import {
    Controller,
    Get,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import type { UserResponse } from '../../common/responses/user.response';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PageResponse } from '../../common/responses/page.response';
import { UserListResponse } from '../../common/responses/user-list.response';
import { ApiGetAllUsers } from '../../swagger/decorators/api-get-all-users.decorator';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiGetAllUsers()
    @Get('all')
    @UseInterceptors(ClassSerializerInterceptor)
    public async getAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageResponse<UserResponse>> {
        const [data, meta] = await this.userService.getAll(pageOptionsDto);

        const userList = new UserListResponse(data);

        return new PageResponse(userList.users, meta);
    }
}
