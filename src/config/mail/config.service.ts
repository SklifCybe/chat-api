import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/types/environment.type';

@Injectable()
export class MailConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly host = this.configService.get<string>('EMAIL_HOST');
    public readonly user = this.configService.get<string>('EMAIL_USER');
    public readonly password = this.configService.get<string>('EMAIL_PASSWORD');
}
