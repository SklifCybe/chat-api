import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    EXAMPLE_INTERNAL_SERVER_ERROR,
    EXAMPLE_ERROR_NAME_INTERNAL_SERVER_ERROR,
    EXAMPLE_ERROR_CODE_INTERNAL_SERVER_ERROR,
} from '../constants/swagger-example.constant';

export class IncorrectExpiredCodeConversationResponse implements HttpExceptionBody {
    @ApiProperty({ example: EXAMPLE_INTERNAL_SERVER_ERROR })
    public readonly message: string;

    @ApiProperty({ example: EXAMPLE_ERROR_NAME_INTERNAL_SERVER_ERROR })
    public readonly error: string;

    @ApiProperty({ example: EXAMPLE_ERROR_CODE_INTERNAL_SERVER_ERROR })
    public readonly statusCode: number;
}
