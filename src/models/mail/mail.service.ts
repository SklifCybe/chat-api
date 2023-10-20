import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { VERIFICATION_MAIL_FOLDER } from '../../common/constants/paths.constant';
import { APPLICATION_NAME } from '../../common/constants/application-name.constant';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendUserConfirmationCode(
        firstName: string,
        lastName: string,
        email: string,
        confirmationCode: string,
    ): Promise<void> {
        const subject = `Registration Confirmation for ${APPLICATION_NAME}`;

        await this.mailerService.sendMail({
            to: email,
            subject,
            template: join(VERIFICATION_MAIL_FOLDER, 'content'),
            context: {
                firstName,
                lastName,
                confirmationCode,
                applicationName: APPLICATION_NAME,
            },
        });
    }
}
