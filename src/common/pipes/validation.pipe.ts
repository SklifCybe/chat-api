import { ValidationPipe as NestValidationPipe } from '@nestjs/common';
import type { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { exceptionFactory } from '../../common/utils/exception-factory';

@Injectable()
export class ValidationPipe implements PipeTransform {
    private readonly nestValidationPipe: NestValidationPipe;

    constructor() {
        this.nestValidationPipe = new NestValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory,
        });
    }

    public transform(value: any, metadata: ArgumentMetadata) {
        return this.nestValidationPipe.transform(value, metadata);
    }
}
