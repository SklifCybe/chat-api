import { Module } from '@nestjs/common';
import { AuthenticationConfigService } from './config.service';

@Module({
    providers: [AuthenticationConfigService],
    exports: [AuthenticationConfigService],
})
export class AuthenticationConfigModule {}
