import { Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import type { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    public async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;
        const hashedPassword = await this.hashPassword(password);

        return this.userRepository.create(email, hashedPassword);
    }

    public async findOneById(id: User['id']): Promise<User> {
        return this.userRepository.findOneById(id);
    }

    public async remove(id: User['id']): Promise<User> {
        return this.userRepository.remove(id);
    }

    private async hashPassword(password: User['password']): Promise<User['password']> {
        const salt = await genSalt();

        return hash(password, salt);
    }
}
