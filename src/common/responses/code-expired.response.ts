import { ApiProperty } from '@nestjs/swagger';
import type { Time } from '../interfaces/time.interface';
import { examples } from '../../swagger/config.json';

const { code_expired } = examples;

export class CodeExpiredResponse {
    @ApiProperty({ example: code_expired })
    public readonly codeExpired: Time['confirmTime'];

    constructor(confirmTime: Time['confirmTime']) {
        this.codeExpired = confirmTime;
    }
}
