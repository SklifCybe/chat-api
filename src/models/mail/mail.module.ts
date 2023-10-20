import { Module } from '@nestjs/common';
import { MailProviderModule } from '../../providers/mail/provider.module';
import { MailService } from './mail.service';

@Module({
    imports: [MailProviderModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}