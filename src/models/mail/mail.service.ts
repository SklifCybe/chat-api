import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { APPLICATION_NAME } from '../../common/constants/application-name.constant';

@Injectable()
export class MailService {
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
        const subject = `Registration Confirmation for ${APPLICATION_NAME}`;

        await this.mailerService.sendMail({
            to: email,
            subject,
            template: this.VERIFICATION_FOLDER,
            context: {
                firstName,
                lastName,
                confirmationCode,
                applicationName: APPLICATION_NAME,
            },
        });
    }

    public async sendSuccessfulSignUp(email: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Successful Registration',
            template: this.SUCCESSFUL_SIGN_UP_FOLDER,
            context: {
                applicationName: APPLICATION_NAME,
            },
        });
    }
}
