import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNumberString } from 'class-validator';

export class ConfirmDto {
    @ApiProperty({ example: 'i.s.toaccept@gmail.com' })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ minLength: 4, maxLength: 4, example: '1234' })
    @IsNumberString()
    @Length(4, 4)
    public readonly code: string;
}
