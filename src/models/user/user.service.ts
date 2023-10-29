import { Injectable, Logger } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import type { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import type { SignUpDto } from '../../authentication/dto/sign-up.dto';
import type { ConfigurationUser } from '../../common/interfaces/configuration-user.interface';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(private readonly userRepository: UserRepository) {}

    public async create(createUserDto: SignUpDto): Promise<User | null> {
        const { email, password, firstName, lastName } = createUserDto;
        const hashedPassword = await this.hashPassword(password);

        if (hashedPassword === null) {
            return null;
        }

        return this.userRepository.create(firstName, lastName, email, hashedPassword);
    }

    public async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOne(id);
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne(email);
    }

    public async remove(id: string): Promise<User | null> {
        return this.userRepository.remove(id);
    }

    public async confirm(id: string): Promise<User | null> {
        return this.userRepository.confirm(id);
    }

    public async update(id: string, updateFields: ConfigurationUser['updateFields']): Promise<User | null> {
        if (updateFields.password) {
            const hashedPassword = await this.hashPassword(updateFields.password);

            if (hashedPassword === null) {
                return null;
            }

            return this.userRepository.update(id, { ...updateFields, password: hashedPassword });
        }

        return this.userRepository.update(id, updateFields);
    }

    private async hashPassword(password: string): Promise<string | null> {
        try {
            const salt = await genSalt();

            return hash(password, salt);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
