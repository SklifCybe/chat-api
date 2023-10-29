import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './models/user/user.module';
import { PrismaModule } from './models/prisma/prisma.module';
import { UserProfile } from './models/user-profile/user-profile.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { IsEmailUniqueValidate } from './common/decorators/is-email-unique.decorator';
import { ApplicationConfigModule } from './config/application/config.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CacheManagerModule } from './models/cache-manager/cache-manager.module';
import { RedisProviderModule } from './providers/redis/provider.module';

@Module({
    imports: [
        UserModule,
        UserProfile,
        PrismaModule,
        AuthenticationModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ApplicationConfigModule,
        RedisProviderModule,
        CacheManagerModule,
    ],
    controllers: [],
    providers: [IsEmailUniqueValidate, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
