import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { swaggerSetup } from './swagger/swagger-setup.swagger';
import { AppModule } from './app.module';
import { exceptionFactory } from './common/utils/exception-factory';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger();

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
    // todo: maybe think about ping postgres db and redis, if postgres or redis not answer. just proccess.exit(1). but remember db or redis maybe answer from second or third ping. think about it
    // todo: set port to .env config
    await app.listen(3000, async () => {
        const serverUrl = await app.getUrl();

        logger.log(`Server has been started in ${serverUrl}`);
    });
}
bootstrap();
