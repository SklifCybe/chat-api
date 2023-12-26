import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from '../dtos/page-meta-dto';
import { UserResponse } from './user.response';

export class PageResponse<T> {
    @IsArray()
    @ApiProperty({ isArray: true, type: UserResponse })
    private readonly data: T[];

    @ApiProperty({ type: () => PageMetaDto })
    private readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        Object.assign(this, { data, meta });
    }
}
