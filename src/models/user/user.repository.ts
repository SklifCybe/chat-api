import { Injectable, Logger } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { ConfigurationUser } from '../../common/interfaces/configuration-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CacheManagerService } from '../cache-manager/cache-manager.service';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheManagerService: CacheManagerService,
    ) {}

    public async create(
        firstName: string,
        lastName: string,
        email: string,
        hashedPassword: string,
    ): Promise<User | null> {
        try {
            return this.prismaService.user.create({
                data: { firstName, lastName, email, password: hashedPassword },
            });
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async findOne(idOrEmail: string): Promise<User | null> {
        const user = await this.cacheManagerService.get<User | undefined | null>(idOrEmail);

        if (user) {
            return user;
        }

        try {
            // todo: check user.findFirst throw or not exception
            const foundUser = await this.prismaService.user.findFirst({
                where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
            });

            await this.cacheManagerService.set(idOrEmail, foundUser);

            return foundUser;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async remove(id: string): Promise<User | null> {
        try {
            // todo: check user.delete throw or not exception
            const user = await this.prismaService.user.delete({ where: { id } });

            await Promise.allSettled([this.cacheManagerService.del(user.id), this.cacheManagerService.del(user.email)]);

            return user;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async confirm(id: string): Promise<User | null> {
        try {
            return this.prismaService.user.update({ where: { id }, data: { mailConfirmed: true } });
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async update(id: string, updateFields: ConfigurationUser['updateFields']): Promise<User | null> {
        try {
            return this.prismaService.user.update({ where: { id }, data: updateFields });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
