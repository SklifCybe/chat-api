import {
    Body,
    Controller,
    Param,
    Post,
    Get,
    Delete,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from '../../common/response/user.response';
import { UserService } from './user.service';

// todo: you use UserController in your application?
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    public async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.userService.create(createUserDto);

        return new UserResponse(user);
    }

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
    public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        const user = await this.userService.remove(id);

        return new UserResponse(user);
    }
}
