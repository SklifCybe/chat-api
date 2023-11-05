import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/types/environment.type';

@Injectable()
export class RedisConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly url = this.configService.get<string>('REDIS_URL');
}
