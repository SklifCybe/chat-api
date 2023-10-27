import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { swaggerSetup } from './common/helpers/swagger-setup.helper';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.use(cookieParser());

    swaggerSetup(app);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(3000);
}
bootstrap();
