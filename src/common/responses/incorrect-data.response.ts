import type { HttpExceptionBody } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { examples } from '../../swagger/config.json';

const { incorrect_data, bad_request, status_code_bad_request } = examples;

export class IncorrectDataResponse implements HttpExceptionBody {
    @ApiProperty({ example: incorrect_data })
    public readonly message: string;

    @ApiProperty({ example: bad_request })
    public readonly error: string;

    @ApiProperty({ example: status_code_bad_request })
    public readonly statusCode: number;
}
