import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/interfaces/environment.interface';
import { convertTime } from '../../common/utils/convert-time';

// todo: delete and transfer to redis
@Injectable()
export class UserConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    private readonly userExpireTime = this.configService.get<string>('JWT_EXPIRE');

    public getUserExpireTimeInMilliseconds(): number {
        return typeof this.userExpireTime === 'undefined' ? 0 : convertTime('seconds', this.userExpireTime);
    }
}
