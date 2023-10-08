import { Body, Controller, Param, Post, Get, Delete, ParseUUIDPipe } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

// todo: you use UserController in your application?
@Controller('user')
export class UserController {hy
    constructor(private readonly userService: UserService) {}

    @Post()
    public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get(':id')
    public async findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
        return this.userService.findOneById(id);
    }

    @Delete(':id')
    public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return this.userService.remove(id);
    }
}
