import { Cache } from 'cache-manager';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheManagerService {
    private readonly logger = new Logger(CacheManagerService.name);
    private readonly KEY_CODE_CONFIRM = 'CODE-CONFIRMED';

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public async getCodeConfirm(email: string): Promise<string | undefined | null> {
        return this.get<string>(`${this.KEY_CODE_CONFIRM}:${email}`);
    }

    public async setCodeConfirm(email: string, code: string, ttl: number): Promise<void> {
        await this.set<string>(`${this.KEY_CODE_CONFIRM}:${email}`, code, ttl);
    }

    public async delCodeConfirm(email: string): Promise<void> {
        await this.del(`${this.KEY_CODE_CONFIRM}:${email}`);
    }

    public async get<T>(key: string): Promise<T | undefined | null> {
        try {
            return this.cacheManager.get<T>(key);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async set<T>(key: string, value: T): Promise<T | null>;
    public async set<T>(key: string, value: T, ttl: number): Promise<T | null>;
    public async set<T>(key: string, value: T, ttl?: number): Promise<T | null> {
        try {
            if (typeof ttl === 'number') {
                return this.cacheManager.set<T>(key, value, { ttl });
            }

            return this.cacheManager.set<T>(key, value);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async del(key: string): Promise<void> {
        try {
            await this.cacheManager.del(key);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
