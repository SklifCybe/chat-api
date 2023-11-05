import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, MinLength, IsOptional } from 'class-validator';
import { File } from '../../../common/types/file.type';

export class UpdateUserDto {
    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: 'Ilya' })
    @IsOptional()
    @IsString()
    @Length(2, 20)
    public readonly firstName?: string;

    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: 'Strelkovskiy' })
    @IsOptional()
    @IsString()
    @Length(2, 20)
    public readonly lastName?: string;

    @ApiPropertyOptional({ minLength: 6, example: '123456' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    public readonly password?: string;

    @ApiPropertyOptional({ type: 'file' })
    @IsOptional()
    public readonly file?: File
}