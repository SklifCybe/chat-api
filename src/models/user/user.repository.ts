import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(email: string, hashedPassword: string): Promise<User> {
        return this.prismaService.user.create({
            data: { email, password: hashedPassword },
        });
    }

    public async findOneById(id: User['id']): Promise<User | undefined> {
        // todo: check user.findFirst throw or not exception
        return this.prismaService.user.findFirst({ where: { id } });
    }

    public async remove(id: User['id']): Promise<User> {
        // todo: check user.delete throw or not exception
        return this.prismaService.user.delete({ where: { id } });
    }
}
