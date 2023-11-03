import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse implements HttpExceptionBody {
    @ApiProperty({ example: 'Error message' })
    public readonly message: string;

    @ApiProperty({ example: 'Error name' })
    public readonly error: string;

    @ApiProperty({ example: 400 })
    public readonly statusCode: number;
}
