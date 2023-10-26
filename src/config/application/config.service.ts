import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEVELOPMENT, PRODUCTION } from '../../common/constants/application-status.constant';
import type { Environment } from '../../common/interfaces/environment.interface';

@Injectable()
export class ApplicationConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    private readonly applicationStatus = this.configService.get<string>('NODE_ENV', DEVELOPMENT);
    public readonly isProduction = this.applicationStatus === PRODUCTION;
}
