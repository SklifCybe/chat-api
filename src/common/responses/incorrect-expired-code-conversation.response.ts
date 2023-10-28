import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { examples } from '../../swagger/config.json';

const { incorrect_code_convert, internal_server_error, status_code_internal_server_error } = examples;

export class IncorrectExpiredCodeConversationResponse implements HttpExceptionBody {
    @ApiProperty({ example: incorrect_code_convert })
    public readonly message: string;

    @ApiProperty({ example: internal_server_error })
    public readonly error: string;

    @ApiProperty({ example: status_code_internal_server_error })
    public readonly statusCode: number;
}
