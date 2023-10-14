import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserCacheProviderModule } from '../../providers/user-cache/provider.module';

@Module({
    imports: [UserCacheProviderModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
