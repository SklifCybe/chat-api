import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { convertTime } from '../../common/utils/convert-time';
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
        return convertTime('seconds', this.confirmTime);
    }
}
