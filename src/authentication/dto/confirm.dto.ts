import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 4, maxLength: 4 })
    @IsString()
    @Length(4, 4)
    code: string;
}
