import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import type { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import type { SignUpDto } from '../../authentication/dto/sign-up.dto';
import type { UpdateUserFields } from '../../common/types/configuration-user.type';
import type { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PageMetaDto } from '../../common/dtos/page-meta-dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    public async getAll(pageOptionsDto: PageOptionsDto): Promise<[User[], PageMetaDto]> {
        const { limit, orderBy, page, searchBy, searchText } = pageOptionsDto;
        const offset = (page - 1) * limit;

        const data = await this.userRepository.findMany(orderBy, offset, limit, searchBy, searchText);
        const total = await this.userRepository.count();

        if (!data || !total) {
            throw new BadRequestException();
        }

        const meta = new PageMetaDto({ limit, offset, page, total });

        return [data, meta];
    }

    public async create(createUserDto: SignUpDto): Promise<User | null> {
        const { email, password, firstName, lastName, userName } = createUserDto;
        const hashedPassword = await this.hashPassword(password);

        const avatarUrl = await this.cloudinaryService.getDefaultAvatarUrl();

        if (hashedPassword === null || avatarUrl === null) {
            return null;
        }

        return this.userRepository.create(firstName, lastName, userName, email, hashedPassword, avatarUrl);
    }

    public async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOne(id);
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne(email);
    }

    public async findOneByUserName(userName: string): Promise<User | null> {
        return this.userRepository.findOne(userName);
    }

    public async remove(id: string): Promise<User | null> {
        return this.userRepository.remove(id);
    }

    public async confirm(id: string): Promise<User | null> {
        return this.userRepository.confirm(id);
    }

    public async update(id: string, updateFields: UpdateUserFields): Promise<User | null> {
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
