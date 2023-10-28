import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNumberString } from 'class-validator';
import { examples } from '../../swagger/config.json';

const { email, code } = examples;

export class ConfirmDto {
    @ApiProperty({ example: email })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ minLength: 4, maxLength: 4, example: code })
    @IsNumberString()
    @Length(4, 4)
    public readonly code: string;
}
