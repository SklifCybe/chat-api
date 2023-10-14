import { Module } from '@nestjs/common';
import { UserConfigService } from './config.service';

@Module({
    providers: [UserConfigService],
    exports: [UserConfigService],
})
export class UserConfigModule {}
