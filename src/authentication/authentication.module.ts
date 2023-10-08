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

@Module({
    imports: [PassportModule, UserModule, AuthenticationProviderModule],
    controllers: [AuthenticationController],
    providers: [
        AuthenticationService,
        AuthenticationRepository,
        JwtService,
        AuthenticationConfigService,
        ApplicationConfigService,
    ],
})
export class AuthenticationModule {}
