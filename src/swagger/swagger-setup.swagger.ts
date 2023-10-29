import type { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerSetup = (application: INestApplication) => {
    // todo: add host
    const config = new DocumentBuilder()
        .setTitle('Chat Api')
        .setDescription('Created by Ilya Strelkovskiy')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(application, config);
    SwaggerModule.setup('/', application, document);
};
