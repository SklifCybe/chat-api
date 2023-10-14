import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    public async create(email: string, hashedPassword: string): Promise<User> {
        return this.prismaService.user.create({
            data: { email, password: hashedPassword },
        });
    }

    public async findOne(idOrEmail: string): Promise<User | null> {
        const user = await this.cacheManager.get<User | null>(idOrEmail);

        if (user) {
            return user;
        }

        // todo: check user.findFirst throw or not exception
        const foundUser = await this.prismaService.user.findFirst({
            where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
        });

        await this.cacheManager.set(idOrEmail, foundUser);

        return foundUser;
    }

    public async remove(id: string): Promise<User> {
        // todo: check user.delete throw or not exception
        return this.prismaService.user.delete({ where: { id } });
    }
}
