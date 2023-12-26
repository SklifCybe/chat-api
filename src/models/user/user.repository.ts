import { Injectable, Logger } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { UpdateUserFields } from '../../common/types/configuration-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import type { Order } from '../../common/constants/order.constant';
import type { UserSearchBy } from '../../common/constants/user-search-by.constant';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheManagerService: CacheManagerService,
    ) {}

    public async findMany(
        orderBy: Order,
        offset: number,
        limit: number,
        searchBy: UserSearchBy,
        searchText?: string,
    ): Promise<User[] | null> {
        try {
            return this.prismaService.user.findMany({
                orderBy: {
                    userName: orderBy,
                },
                skip: offset,
                take: limit,
                where: {
                    [searchBy]: {
                        contains: searchText,
                        mode: 'insensitive'
                    },
                },
            });
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async create(
        firstName: string,
        lastName: string,
        userName: string,
        email: string,
        hashedPassword: string,
    ): Promise<User | null> {
        try {
            return this.prismaService.user.create({
                data: { firstName, lastName, userName, email, password: hashedPassword },
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

    public async update(id: string, updateFields: UpdateUserFields): Promise<User | null> {
        try {
            return this.prismaService.user.update({ where: { id }, data: updateFields });
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async count(): Promise<number | null> {
        try {
            return this.prismaService.user.count();
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
