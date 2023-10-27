import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ApplicationConfigModule } from '../../../config/application/config.module';
import { MailConfigService } from '../../../config/mail/config.service';
import { MailProviderModule } from '../../../providers/mail/provider.module';
import { MailService } from '../mail.service';
import { APPLICATION_NAME } from '../../../common/constants/application-name.constant';
import { confirmationCode, email, firstName, lastName, mockMailerService } from './mocks/mail.service.mock';

describe('MailService', () => {
    let mailService: MailService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), MailProviderModule, ApplicationConfigModule],
            providers: [
                MailService,
                MailConfigService,
                {
                    provide: MailerService,
                    useValue: mockMailerService,
                },
            ],
        }).compile();

        mailService = moduleRef.get<MailService>(MailService);
    });

    describe('sendConfirmationCode', () => {
        it('should call sendMail with correct arguments', async () => {
            const received = {
                to: email,
                subject: `Registration Confirmation for ${APPLICATION_NAME}`,
                template: join(process.cwd(), 'src', 'mails', 'verification', 'content'),
                context: {
                    firstName,
                    lastName,
                    confirmationCode,
                    applicationName: APPLICATION_NAME,
                },
            };

            await mailService.sendConfirmationCode(firstName, lastName, email, confirmationCode);

            expect(mockMailerService.sendMail).toHaveBeenCalledWith(received);
        });
    });

    describe('sendSuccessfulSignUp', () => {
        it('should call sendMail with correct arguments', async () => {
            const received = {
                to: email,
                subject: 'Successful Registration',
                template: join(process.cwd(), 'src', 'mails', 'successful-sign-up', 'content'),
                context: {
                    applicationName: APPLICATION_NAME,
                },
            };

            await mailService.sendSuccessfulSignUp(email);

            expect(mockMailerService.sendMail).toHaveBeenCalledWith(received);
        });
    });
});
