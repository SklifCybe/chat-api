import type { HttpExceptionBody } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class EmailConflictResponse implements HttpExceptionBody {
    @ApiProperty({ example: 'Email i.s.toaccept@gmail.com - already exist' })
    public readonly message: string;

    @ApiProperty({ example: 'Conflict' })
    public readonly error: string;

    @ApiProperty({ example: 409 })
    public readonly statusCode: number;

    constructor(message: string, error: string) {
        this.message = message;
        this.error = error;
        this.statusCode = HttpStatus['CONFLICT'];
    }
}
