import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { swaggerSetup } from './swagger/swagger-setup.swagger';
import { AppModule } from './app.module';
import { exceptionFactory } from './common/utils/exception-factory';

// todo: what is oauth2????
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory,
        }),
    );
    app.use(cookieParser());

    swaggerSetup(app);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    // todo: add info log, then listen port and maybe host
    await app.listen(3000);
}
bootstrap();
