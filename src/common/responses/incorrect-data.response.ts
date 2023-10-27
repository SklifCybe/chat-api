import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class IncorrectDataResponse implements HttpExceptionBody {
    @ApiProperty({ example: 'Incorrect data. Please try again.' })
    public readonly message: string;

    @ApiProperty({ example: 'Bad Request' })
    public readonly error: string;

    @ApiProperty({ example: 400 })
    public readonly statusCode: number;
}
