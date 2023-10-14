import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationConfigModule } from '../../config/authentication/config.module';
import { AuthenticationConfigService } from '../../config/authentication/config.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [AuthenticationConfigModule],
            inject: [AuthenticationConfigService],
            useFactory: async (authenticationConfigService: AuthenticationConfigService) => ({
                secret: authenticationConfigService.secret,
                signOptions: authenticationConfigService.signOptions,
            }),
        }),
    ],
})
export class AuthenticationProviderModule {}
