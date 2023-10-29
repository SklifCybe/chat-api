import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, MinLength, IsOptional } from 'class-validator';
import { examples } from '../../../swagger/config.json';

const { first_name, last_name, password } = examples;

export class UpdateUserDto {
    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: first_name })
    @IsOptional()
    @IsString()
    @Length(2, 20)
    public readonly firstName: string;

    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: last_name })
    @IsOptional()
    @IsString()
    @Length(2, 20)
    public readonly lastName: string;

    @ApiPropertyOptional({ minLength: 6, example: password })
    @IsOptional()
    @IsString()
    @MinLength(6)
    public readonly password: string;
}