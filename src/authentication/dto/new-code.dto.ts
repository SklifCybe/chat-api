import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class NewCodeDto {
    @ApiProperty({ example: 'i.s.toaccept@gmail.com' })
    @IsEmail()
    public readonly email: string;
}
