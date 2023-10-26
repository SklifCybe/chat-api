import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/interfaces/environment.interface';

@Injectable()
export class RedisConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly url = this.configService.get<string>('REDIS_URL');
}
