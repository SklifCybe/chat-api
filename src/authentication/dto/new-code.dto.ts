import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { examples } from '../../swagger/config.json';

const { email } = examples;

export class NewCodeDto {
    @ApiProperty({ example: email })
    @IsEmail()
    public readonly email: string;
}
