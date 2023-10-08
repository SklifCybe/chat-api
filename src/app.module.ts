import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './models/user/user.module';
import { PrismaModule } from './models/prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { IsEmailUniqueValidate } from './common/decorators/is-email-unique.decorator';
import { ApplicationConfigModule } from './config/application/config.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
    imports: [
        UserModule,
        PrismaModule,
        AuthenticationModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ApplicationConfigModule,
    ],
    controllers: [],
    providers: [IsEmailUniqueValidate, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
