import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { UserModule } from '../src/models/user/user.module';
import { PrismaModule } from '../src/models/prisma/prisma.module';
import { CacheManagerModule } from '../src/models/cache-manager/cache-manager.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { IsEmailUniqueValidate } from '../src/common/decorators/is-email-unique.decorator';
import { ApplicationConfigModule } from '../src/config/application/config.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { RedisProviderModule } from '../src/providers/redis/provider.module';

describe('user-controller', () => {
    let app: INestApplication;
    const userService = {
        findOneById: (id: string) => id,
    };

    beforeEach(async () => {
        const userModule = await Test.createTestingModule({
            imports: [
                UserModule,
                PrismaModule,
                AuthenticationModule,
                ConfigModule.forRoot({ isGlobal: true }),
                ApplicationConfigModule,
                RedisProviderModule,
                CacheManagerModule,
            ],
            controllers: [],
            providers: [IsEmailUniqueValidate, { provide: APP_GUARD, useClass: JwtAuthGuard }],
        }).compile();

        app = userModule.createNestApplication();
        await app.init();
    });

    it('/GET:id user', () => {
        return request(app.getHttpServer())
            .get('/user/123')
            .expect(200)
            .expect({
                data: userService.findOneById('123'),
            });
    });

    afterAll(async () => {
        await app.close();
    });

    // describe('findOneById', () => {
    //     it('should get user by id', async () => {
    //         const mock = new Promise<User>((resolve) =>
    //             resolve({
    //                 email: 'test@gmail.com',
    //                 firstName: 'First',
    //                 lastName: 'Second',
    //                 id: '17c3a4f9-3b83-4b65-900a-cc6ff0d93bfb',
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 mailConfirmed: false,
    //                 password: 'security',
    //             }),
    //         );
    //         const result = new Promise<any>((resolve) =>
    //             resolve({
    //                 email: 'test@gmail.com',
    //                 firstName: 'First',
    //                 lastName: 'Second',
    //                 id: '17c3a4f9-3b83-4b65-900a-cc6ff0d93bfb',
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 mailConfirmed: false,
    //                 password: 'security',
    //             }),
    //         );
    //         jest.spyOn(userService, 'findOneById').mockImplementation(() => mock);

    //         expect(await userController.findOneById('17c3a4f9-3b83-4b65-900a-cc6ff0d93bfb')).toEqual(await result);
    //     });
    // });
});
