import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    EXAMPLE_INCORRECT_DATA,
    EXAMPLE_ERROR_CODE_BAD_REQUEST,
    EXAMPLE_ERROR_NAME_BAD_REQUEST,
} from '../constants/swagger-example.constant';

export class IncorrectDataResponse implements HttpExceptionBody {
    @ApiProperty({ example: EXAMPLE_INCORRECT_DATA })
    public readonly message: string;

    @ApiProperty({ example: EXAMPLE_ERROR_NAME_BAD_REQUEST })
    public readonly error: string;

    @ApiProperty({ example: EXAMPLE_ERROR_CODE_BAD_REQUEST })
    public readonly statusCode: number;
}
