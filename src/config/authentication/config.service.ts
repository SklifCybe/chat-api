import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Time } from '../../common/interfaces/time.interface';
import { convertTime } from '../../common/utils/convert-time';
import { DEFAULT_TIME_JWT_EXPIRE } from '../../common/constants/jwt.constant';
import type { Environment } from '../../common/interfaces/environment.interface';

@Injectable()
export class AuthenticationConfigService {
    private readonly logger = new Logger(AuthenticationConfigService.name);
    constructor(private readonly configService: ConfigService<Environment>) {}

    private readonly confirmTime = this.configService.getOrThrow<string>('CONFIRM_TIME');

    public readonly secret = this.configService.get<string>('JWT_SECRET');
    public readonly signOptions = {
        expiresIn: this.configService.get<string>('JWT_EXPIRE', DEFAULT_TIME_JWT_EXPIRE),
    };

    public getConfirmTime(): Time['confirmTime'] | null {
        try {
            return {
                seconds: convertTime('seconds', this.confirmTime),
                milliseconds: convertTime('milliseconds', this.confirmTime),
            };
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }
}
