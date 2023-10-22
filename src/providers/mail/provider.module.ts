import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailConfigModule } from '../../config/mail/config.module';
import { MailConfigService } from '../../config/mail/config.service';
import { ApplicationConfigModule } from '../../config/application/config.module';
import { ApplicationConfigService } from '../../config/application/config.service';
import { APPLICATION_NAME } from '../../common/constants/application-name.constant';
import { join } from 'path';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [MailConfigModule, ApplicationConfigModule],
            inject: [MailConfigService, ApplicationConfigService],
            useFactory: async (
                mailConfigService: MailConfigService,
                applicationConfigService: ApplicationConfigService,
            ) => ({
                transport: {
                    host: mailConfigService.host,
                    secure: applicationConfigService.isProduction,
                    auth: {
                        user: mailConfigService.user,
                        pass: mailConfigService.password,
                    },
                },
                defaults: {
                    from: {
                        name: APPLICATION_NAME,
                        address: mailConfigService.user || '',
                    },
                },
                template: {
                    dir: join(process.cwd(), 'src/mails'),
                    adapter: new EjsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
})
export class MailProviderModule {}
