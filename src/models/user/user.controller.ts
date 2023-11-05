import {
    Controller,
    Param,
    Get,
    Delete,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
    ForbiddenException,
} from '@nestjs/common';
import { UserResponse } from '../../common/responses/user.response';
import { UserService } from './user.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/jwt.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// todo: add unit test to user.controller.ts
@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    public async findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse | null> {
        const user = await this.userService.findOneById(id);

        if (!user) {
            return null;
        }

        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':id')
    public async remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() userJwtPayload: JwtPayload,
    ): Promise<UserResponse | null> {
        if (id !== userJwtPayload.id) {
            throw new ForbiddenException();
        }

        const user = await this.userService.remove(id);

        if (!user) {
            return null;
        }

        return new UserResponse(user);
    }
}
