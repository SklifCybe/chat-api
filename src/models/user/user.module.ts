import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../config/authentication/config.service';

@Module({
    imports: [],
    providers: [UserService, UserRepository, CacheManagerService, AuthenticationConfigService, PrismaService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
