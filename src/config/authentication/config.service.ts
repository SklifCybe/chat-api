import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/types/environment.type';

@Injectable()
export class AuthenticationConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly confirmTime = this.configService.getOrThrow<string>('CONFIRM_TIME');
    public readonly secret = this.configService.get<string>('JWT_SECRET');
    public readonly expiresIn = this.configService.get<string>('JWT_EXPIRE');
    public readonly refreshTokenExpire = this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRE');
}
