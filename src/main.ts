import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { swaggerSetup } from './swagger/swagger-setup.swagger';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from './common/pipes/validation.pipe';

// todo: refactor all application, change return format in async function. from return do.something, to return await do.something. Or return function result like const result = await do.something(); return result;
// todo: think about change swagger config from json to yml
// todo: 0000 it's code for all confirmation
// todo: add backend app to docker
// todo: when swagger schema is end. remove all decorators and transfer swagger schema to yml file
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger();

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.useWebSocketAdapter(new IoAdapter(app));

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
