import { Module } from '@nestjs/common';
import { MailConfigService } from './config.service';

@Module({
    providers: [MailConfigService],
    exports: [MailConfigService],
})
export class MailConfigModule {}
