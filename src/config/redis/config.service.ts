import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/interfaces/environment.interface';

@Injectable()
export class RedisConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly host = this.configService.get<string>('REDIS_HOST');
    public readonly port = this.configService.get<number>('REDIS_PORT');
    public readonly password = this.configService.get<string>('REDIS_PASSWORD');
}
