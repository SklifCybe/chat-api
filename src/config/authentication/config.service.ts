import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { convertToSeconds } from '../../common/utils/convert-to-seconds';
import { DEFAULT_TIME_JWT_EXPIRE } from '../../common/constants/jwt.constant';
import type { Environment } from '../../common/interfaces/environment.interface';

@Injectable()
export class AuthenticationConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    private readonly confirmTime = this.configService.getOrThrow<string>('CONFIRM_TIME');

    public readonly secret = this.configService.get<string>('JWT_SECRET');
    public readonly signOptions = {
        expiresIn: this.configService.get<string>('JWT_EXPIRE', DEFAULT_TIME_JWT_EXPIRE),
    };

    public getConfirmTime(): number {
        return convertToSeconds(this.confirmTime);
    }
}
