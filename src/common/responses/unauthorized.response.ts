import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse implements HttpExceptionBody {
    @ApiProperty({ example: 'Wrong email or password.' })
    public readonly message: string;

    @ApiProperty({ example: 'Unauthorized' })
    public readonly error: string;

    @ApiProperty({ example: 401 })
    public readonly statusCode: number;
}
