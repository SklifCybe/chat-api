import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NODE_ENV } from '../../common/constants/env-variables.constant';
import { DEVELOPMENT, PRODUCTION } from '../../common/constants/application-status.constant';

@Injectable()
export class ApplicationConfigService {
    constructor(private readonly configService: ConfigService) {}

    private readonly applicationStatus = this.configService.get<string>(NODE_ENV, DEVELOPMENT);
    public readonly isProduction = this.applicationStatus === PRODUCTION;
}
