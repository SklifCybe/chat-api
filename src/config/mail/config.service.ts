import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD } from '../../common/constants/env-variables.constant';

@Injectable()
export class MailConfigService {
    constructor(private readonly configService: ConfigService) {}

    public readonly host = this.configService.get<string>(EMAIL_HOST);
    public readonly user = this.configService.get<string>(EMAIL_USER);
    public readonly password = this.configService.get<string>(EMAIL_PASSWORD);
}
