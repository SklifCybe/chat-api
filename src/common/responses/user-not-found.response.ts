import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { examples } from '../../swagger/config.json';

const { user_not_found, not_found, status_code_not_found } = examples;

export class UserNotFoundResponse implements HttpExceptionBody {
    @ApiProperty({ example: user_not_found })
    public readonly message: string;

    @ApiProperty({ example: not_found })
    public readonly error: string;

    @ApiProperty({ example: status_code_not_found })
    public readonly statusCode: number;
}
