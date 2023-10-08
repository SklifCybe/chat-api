import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './models/user/user.module';
import { PrismaModule } from './models/prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { IsEmailUniqueValidate } from './common/decorators/is-email-unique.decorator';
import { ApplicationConfigModule } from './config/application/config.module';

@Module({
    imports: [
        UserModule,
        PrismaModule,
        AuthenticationModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ApplicationConfigModule,
    ],
    controllers: [],
    providers: [IsEmailUniqueValidate],
})
export class AppModule {}
