import { Cache } from 'cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthenticationConfigService } from '../../config/authentication/config.service';

@Injectable()
export class CacheInformationService {
    private readonly KEY_CODE_CONFIRM = 'CODE-CONFIRMED';

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly authenticationConfigService: AuthenticationConfigService,
    ) {}

    public async getCodeConfirm(email: string): Promise<number | undefined> {
        return this.cacheManager.get<number>(`${this.KEY_CODE_CONFIRM}:${email}`);
    }

    public async setCodeConfirm(email: string, code: string): Promise<void> {
        const ttl = this.authenticationConfigService.getConfirmTime();

        await this.cacheManager.set(`${this.KEY_CODE_CONFIRM}:${email}`, code, { ttl });
    }
}
