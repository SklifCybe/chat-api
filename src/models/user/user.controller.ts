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
import { UserResponse } from '../../common/response/user.response';
import { UserService } from './user.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/jwt.interface';

// todo: you use UserController in your application?
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
    ): Promise<UserResponse> {
        if (id !== userJwtPayload.id) {
            throw new ForbiddenException();
        }

        const user = await this.userService.remove(id);

        return new UserResponse(user);
    }
}
