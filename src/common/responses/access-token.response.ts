import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {
    @ApiProperty({
        example:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzlhZmI1LWQzZGUtNDQzNC05YmFiLTkyNjI1MjcwZTUzMCIsImVtYWlsIjoiaS5zLnRvYWNjZXB0QGdtYWlsLmNvbSIsImlhdCI6MTY5ODQxMDM1OH0.xQwmbZuhhN5Aw9TPdDjALwiM2XywPMbPlS2uUYIGdxw',
    })
    public readonly accessToken: string;
}
