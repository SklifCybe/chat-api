import { Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import type { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import type { SignUpDto } from '../../authentication/dto/sign-up.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    public async create(createUserDto: SignUpDto): Promise<User> {
        const { email, password, firstName, lastName } = createUserDto;
        const hashedPassword = await this.hashPassword(password);

        return this.userRepository.create(firstName, lastName, email, hashedPassword);
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

    public async confirm(id: string): Promise<User> {
        return this.userRepository.confirm(id);
    }

    private async hashPassword(password: User['password']): Promise<User['password']> {
        const salt = await genSalt();

        return hash(password, salt);
    }
}
