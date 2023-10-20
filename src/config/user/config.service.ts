import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_EXPIRE } from '../../common/constants/env-variables.constant';
import { convertToSeconds } from '../../common/utils/convert-to-seconds.util';

// todo: delete and transfer to redis
@Injectable()
export class UserConfigService {
    constructor(private readonly configService: ConfigService) {}

    private readonly userExpireTime = this.configService.get<string>(JWT_EXPIRE);

    public getUserExpireTimeInMilliseconds(): number {
        return typeof this.userExpireTime === 'undefined' ? 0 : convertToSeconds(this.userExpireTime);
    }
}
