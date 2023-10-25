import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { APPLICATION_NAME } from '../../common/constants/application-name.constant';

@Injectable()
export class MailService {
    private logger = new Logger(MailService.name);
    private readonly MAIL_FOLDER = join(process.cwd(), 'src', 'mails');
    private readonly VERIFICATION_FOLDER = join(this.MAIL_FOLDER, 'verification', 'content');
    private readonly SUCCESSFUL_SIGN_UP_FOLDER = join(this.MAIL_FOLDER, 'successful-sign-up', 'content');

    constructor(private readonly mailerService: MailerService) {}

    public async sendConfirmationCode(
        firstName: string,
        lastName: string,
        email: string,
        confirmationCode: string,
    ): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Registration Confirmation for ${APPLICATION_NAME}`,
                template: this.VERIFICATION_FOLDER,
                context: {
                    firstName,
                    lastName,
                    confirmationCode,
                    applicationName: APPLICATION_NAME,
                },
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async sendSuccessfulSignUp(email: string): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Successful Registration',
                template: this.SUCCESSFUL_SIGN_UP_FOLDER,
                context: {
                    applicationName: APPLICATION_NAME,
                },
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
