import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_EXPIRE } from '../../common/constants/env-variables.constant';
import { convertToMilliseconds } from '../../common/utils/convert-to-milliseconds.util';

@Injectable()
export class UserConfigService {
    constructor(private readonly configService: ConfigService) {}

    private readonly userExpireTime = this.configService.get<string>(JWT_EXPIRE);

    public getUserExpireTimeInMilliseconds(): number {
        return typeof this.userExpireTime === 'undefined' ? 0 : convertToMilliseconds(this.userExpireTime);
    }
}
