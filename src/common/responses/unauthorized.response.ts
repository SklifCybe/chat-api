import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { examples } from '../../swagger/config.json';

const { wrong_email_or_password, unauthorized, status_code_unauthorized } = examples;

export class UnauthorizedResponse implements HttpExceptionBody {
    @ApiProperty({ example: wrong_email_or_password })
    public readonly message: string;

    @ApiProperty({ example: unauthorized })
    public readonly error: string;

    @ApiProperty({ example: status_code_unauthorized })
    public readonly statusCode: number;
}
