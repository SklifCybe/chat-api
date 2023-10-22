import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../models/user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticationProviderModule } from '../providers/authentication/provider.module';
import { AuthenticationRepository } from './authentication.repository';
import { AuthenticationConfigService } from '../config/authentication/config.service';
import { ApplicationConfigService } from '../config/application/config.service';
import { STRATEGIES } from './strategies';
import { MailModule } from '../models/mail/mail.module';
import { MailService } from '../models/mail/mail.service';
import { CacheManagerService } from '../models/cache-manager/cache-manager.service';

@Module({
    imports: [PassportModule, UserModule, AuthenticationProviderModule, MailModule],
    controllers: [AuthenticationController],
    providers: [
        AuthenticationService,
        AuthenticationRepository,
        JwtService,
        AuthenticationConfigService,
        ApplicationConfigService,
        MailService,
        CacheManagerService,
        ...STRATEGIES,
    ],
})
export class AuthenticationModule {}
