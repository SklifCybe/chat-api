import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    EXAMPLE_EMAIL_ALREADY_EXIST,
    EXAMPLE_ERROR_NAME_CONFLICT,
    EXAMPLE_ERROR_CODE_CONFLICT,
} from '../constants/swagger-example.constant';

export class EmailConflictResponse implements HttpExceptionBody {
    @ApiProperty({ example: EXAMPLE_EMAIL_ALREADY_EXIST })
    public readonly message: string;

    @ApiProperty({ example: EXAMPLE_ERROR_NAME_CONFLICT })
    public readonly error: string;

    @ApiProperty({ example: EXAMPLE_ERROR_CODE_CONFLICT })
    public readonly statusCode: number;
}
