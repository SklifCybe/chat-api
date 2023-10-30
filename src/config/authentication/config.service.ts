import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_TIME_JWT_EXPIRE } from '../../common/constants/jwt.constant';
import type { Environment } from '../../common/interfaces/environment.interface';

@Injectable()
export class AuthenticationConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly confirmTime = this.configService.getOrThrow<string>('CONFIRM_TIME');
    public readonly secret = this.configService.get<string>('JWT_SECRET');
    public readonly signOptions = {
        expiresIn: this.configService.get<string>('JWT_EXPIRE', DEFAULT_TIME_JWT_EXPIRE),
    };
}
