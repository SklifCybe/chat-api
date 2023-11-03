import { ApiProperty } from '@nestjs/swagger';
import type { Time } from '../interfaces/time.interface';

export class CodeExpiredResponse {
    @ApiProperty({
        example: {
            seconds: 60,
            milliseconds: 60000,
        },
    })
    public readonly codeExpired: Time['confirmTime'];

    constructor(confirmTime: Time['confirmTime']) {
        this.codeExpired = confirmTime;
    }
}
