import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { examples } from '../../swagger/config.json';

const { user_already_exist_by_email, conflict, status_code_conflict } = examples;

export class EmailConflictResponse implements HttpExceptionBody {
    @ApiProperty({ example: user_already_exist_by_email })
    public readonly message: string;

    @ApiProperty({ example: conflict })
    public readonly error: string;

    @ApiProperty({ example: status_code_conflict })
    public readonly statusCode: number;
}
