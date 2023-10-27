import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    EXAMPLE_USER_NOT_FOUND,
    EXAMPLE_ERROR_NAME_NOT_FOUND,
    EXAMPLE_ERROR_CODE_NOT_FOUND,
} from '../constants/swagger-example.constant';

export class UserNotFoundResponse implements HttpExceptionBody {
    @ApiProperty({ example: EXAMPLE_USER_NOT_FOUND })
    public readonly message: string;

    @ApiProperty({ example: EXAMPLE_ERROR_NAME_NOT_FOUND })
    public readonly error: string;

    @ApiProperty({ example: EXAMPLE_ERROR_CODE_NOT_FOUND })
    public readonly statusCode: number;
}
