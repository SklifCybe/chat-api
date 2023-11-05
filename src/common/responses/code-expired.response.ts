import { ApiProperty } from '@nestjs/swagger';
import { ConfirmTime } from '../types/time.type';

export class CodeExpiredResponse {
    @ApiProperty({
        example: {
            seconds: 60,
            milliseconds: 60000,
        },
    })
    public readonly codeExpired: ConfirmTime;

    constructor(confirmTime: ConfirmTime) {
        this.codeExpired = confirmTime;
    }
}
