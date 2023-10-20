import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_HOST, REDIS_PORT } from '../../common/constants/env-variables.constant';

@Injectable()
export class RedisConfigService {
    constructor(private readonly configService: ConfigService) {}

    public readonly host = this.configService.get<string>(REDIS_HOST);
    public readonly port = this.configService.get<number>(REDIS_PORT);
}
