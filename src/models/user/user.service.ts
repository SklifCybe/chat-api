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

    public async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOne(id);
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne(email);
    }

    public async remove(id: string): Promise<User> {
        return this.userRepository.remove(id);
    }

    private async hashPassword(password: User['password']): Promise<User['password']> {
        const salt = await genSalt();

        return hash(password, salt);
    }
}
