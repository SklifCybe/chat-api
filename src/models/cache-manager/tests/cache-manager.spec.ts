import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { CacheManagerService } from '../cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import { AuthenticationConfigModule } from '../../../config/authentication/config.module';
import { code, email, mockCacheManager } from './mocks/cache-manager.mock';

describe('CacheManagerService', () => {
    let cacheManagerService: CacheManagerService;
    let keyCodeConfirm: string;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthenticationConfigModule, ConfigModule.forRoot({ isGlobal: true }), RedisProviderModule],
            providers: [
                CacheManagerService,
                AuthenticationConfigService,
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        cacheManagerService = moduleRef.get<CacheManagerService>(CacheManagerService);
        keyCodeConfirm = cacheManagerService['KEY_CODE_CONFIRM'];
    });

    describe('getCodeConfirm', () => {
        it('should get confirmation code without problem', async () => {
            mockCacheManager.get.mockImplementation(() => code);

            const resultCode = await cacheManagerService.getCodeConfirm(email);

            expect(resultCode).toBe(code);
        });

        it('should call with correct arguments', async () => {
            const key = `${keyCodeConfirm}:${email}`;

            await cacheManagerService.getCodeConfirm(email);

            expect(mockCacheManager.get).toHaveBeenCalledWith(key);
        });
    });

    describe('setCodeConfirm', () => {
        it('should call with correct arguments', async () => {
            const key = `${keyCodeConfirm}:${email}`;
            const ttl = 60;

            await cacheManagerService.setCodeConfirm(email, code, ttl);

            expect(mockCacheManager.set).toHaveBeenCalledWith(key, code, { ttl });
        });
    });

    describe('get', () => {
        it('should return correct value by key', async () => {
            mockCacheManager.get.mockImplementation(() => code);

            const resultCode = await cacheManagerService.get(email);

            expect(resultCode).toBe(code);
        });

        it('should return null if cacheManager throw exception', async () => {
            mockCacheManager.get.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const resultCode = await cacheManagerService.get(email);

            expect(resultCode).toBeNull();
        });
    });

    describe('set', () => {
        it('should return value with 2 arguments: key and value', async () => {
            mockCacheManager.set.mockResolvedValueOnce(code);

            const resultCode = await cacheManagerService.set(email, code);

            expect(resultCode).toBe(code);
        });

        it('should return value with 3 argument: key, value and ttl', async () => {
            mockCacheManager.set.mockResolvedValueOnce(code);

            const resultCode = await cacheManagerService.set(email, code, 60);

            expect(resultCode).toBe(code);
        });

        it('should call cacheManager.set with 2 arguments: key and value', async () => {
            await cacheManagerService.set(email, code);

            expect(mockCacheManager.set).toHaveBeenCalledWith(email, code);
        });

        it('should call cacheManager.set with 3 arguments: key, value add ttl', async () => {
            const ttl = 60;

            await cacheManagerService.set(email, code, ttl);

            expect(mockCacheManager.set).toHaveBeenCalledWith(email, code, { ttl });
        });

        it('should return null if cacheManager throw exception', async () => {
            mockCacheManager.set.mockImplementation(
                jest.fn(() => {
                    throw new Error();
                }),
            );

            const resultCode = await cacheManagerService.set(email, code);

            expect(resultCode).toBeNull();
        });
    });

    describe('del', () => {
        it('should call with correct arguments', async () => {
            await cacheManagerService.del(email);

            expect(mockCacheManager.del).toHaveBeenCalledWith(email);
        });
    });
});
