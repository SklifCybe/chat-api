import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    EXAMPLE_WRONG_EMAIL_OR_PASSWORD,
    EXAMPLE_ERROR_NAME_UNAUTHORIZED,
    EXAMPLE_ERROR_CODE_UNAUTHORIZED,
} from '../constants/swagger-example.constant';

export class UnauthorizedResponse implements HttpExceptionBody {
    @ApiProperty({ example: EXAMPLE_WRONG_EMAIL_OR_PASSWORD })
    public readonly message: string;

    @ApiProperty({ example: EXAMPLE_ERROR_NAME_UNAUTHORIZED })
    public readonly error: string;

    @ApiProperty({ example: EXAMPLE_ERROR_CODE_UNAUTHORIZED })
    public readonly statusCode: number;
}
