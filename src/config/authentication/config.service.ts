import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET, JWT_EXPIRE } from '../../common/constants/env-variables.constant';
import { DEFAULT_TIME_JWT_EXPIRE } from '../../common/constants/jwt.constant';

@Injectable()
export class AuthenticationConfigService {
    constructor(private readonly configService: ConfigService) {}

    public readonly secret = this.configService.get<string>(JWT_SECRET);
    public readonly signOptions = {
        expiresIn: this.configService.get<string>(JWT_EXPIRE, DEFAULT_TIME_JWT_EXPIRE),
    };
}
