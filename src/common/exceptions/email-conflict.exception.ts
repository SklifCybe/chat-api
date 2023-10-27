import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class EmailConflictException {
    @ApiProperty({ example: 'Email i.s.toaccept@gmail.com - already exist' })
    public readonly message: string;

    @ApiProperty({ example: 'Conflict' })
    public readonly error: string;

    @ApiProperty({ example: 409 })
    public readonly statusCode: string;

    constructor(message: string, error: string, statusCode: number) {
        this.message = message;
        this.error = error;
        this.statusCode = HttpStatus[statusCode];
    }
}
