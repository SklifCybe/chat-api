import { ApiProperty } from '@nestjs/swagger';
import { examples } from '../../swagger/config.json';

const { bearer_access_token } = examples;

export class AccessTokenResponse {
    @ApiProperty({
        example: bearer_access_token,
    })
    public readonly accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
