import { ApiProperty } from '@nestjs/swagger';
import { EXAMPLE_CODE_EXPIRED } from '../constants/swagger-example.constant';
import type { Time } from '../interfaces/time.interface';

export class CodeExpiredResponse {
    @ApiProperty({ example: EXAMPLE_CODE_EXPIRED })
    public readonly codeExpired: Time['confirmTime'];

    constructor(confirmTime: Time['confirmTime']) {
        this.codeExpired = confirmTime;
    }
}
