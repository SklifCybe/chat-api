import type { ValidationError } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export const exceptionFactory = (errors: Array<ValidationError>): BadRequestException => {
    const firstErrorMessage = errors.map((error) => error.constraints?.[Object.keys(error.constraints)[0]])[0];

    return new BadRequestException(firstErrorMessage);
};
