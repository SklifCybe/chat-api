import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
    @ApiProperty()
    public readonly page: number;

    @ApiProperty()
    public readonly limit: number;

    @ApiProperty()
    public readonly total: number;

    @ApiProperty()
    public readonly offset: number;

    constructor(meta: Record<keyof PageMetaDto, number>) {
        Object.assign(this, meta);
    }
}
