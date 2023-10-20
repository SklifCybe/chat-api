import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './models/user/user.module';
import { PrismaModule } from './models/prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { IsEmailUniqueValidate } from './common/decorators/is-email-unique.decorator';
import { ApplicationConfigModule } from './config/application/config.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CacheInformationModule } from './models/cache-information/cache-information.module';
import { RedisProviderModule } from './providers/redis/provider.module';

@Module({
    imports: [
        UserModule,
        PrismaModule,
        AuthenticationModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ApplicationConfigModule,
        RedisProviderModule,
        CacheInformationModule,
    ],
    controllers: [],
    providers: [IsEmailUniqueValidate, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
