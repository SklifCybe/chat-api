import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { EXAMPLE_EMAIL } from '../../common/constants/swagger-example.constant';

export class NewCodeDto {
    @ApiProperty({ example: EXAMPLE_EMAIL })
    @IsEmail()
    public readonly email: string;
}
