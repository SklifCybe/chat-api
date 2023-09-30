import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { PrismaModule } from './models/prisma/prisma.module';

@Module({
    imports: [UserModule, PrismaModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
