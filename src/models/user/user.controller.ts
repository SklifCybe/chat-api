import { Body, Controller, Param, Post, Get, Delete, ParseUUIDPipe } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        console.log(createUserDto);
        return this.userService.create(createUserDto);
    }

    @Get(':id')
    public async findOneById(@Param('id', ParseUUIDPipe) id: User['id']): Promise<User> {
        return this.userService.findOneById(id);
    }

    @Delete(':id')
    public async remove(@Param('id', ParseUUIDPipe) id: User['id']): Promise<User> {
        return this.userService.remove(id);
    }
}
