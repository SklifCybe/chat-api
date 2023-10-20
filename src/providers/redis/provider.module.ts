import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from "cache-manager-redis-store";
import type { ClientOpts } from "redis";
import { RedisConfigModule } from '../../config/redis/config.module';
import { RedisConfigService } from '../../config/redis/config.service';

@Module({
    imports: [
        CacheModule.registerAsync<ClientOpts>({
            isGlobal: true,
            imports: [RedisConfigModule],
            inject: [RedisConfigService],
            useFactory: async (redisConfigService: RedisConfigService) => ({
                store: redisStore,
                host: redisConfigService.host,
                port: redisConfigService.port,
            }),
        }),
    ],
    exports: [CacheModule],
})
export class RedisProviderModule {}
