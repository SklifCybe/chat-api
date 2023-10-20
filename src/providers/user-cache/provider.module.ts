import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UserConfigModule } from '../../config/user/config.module';
import { UserConfigService } from '../../config/user/config.service';

// todo: remove this module without problem
@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [UserConfigModule],
            inject: [UserConfigService],
            useFactory: async (userConfigService: UserConfigService) => ({
                ttl: userConfigService.getUserExpireTimeInMilliseconds(),
            }),
        }),
    ],
    exports: [CacheModule],
})
export class UserCacheProviderModule {}
