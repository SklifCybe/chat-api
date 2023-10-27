import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { EXAMPLE_EMAIL, EXAMPLE_CODE } from '../../common/constants/swagger-example.constant';

export class ConfirmDto {
    @ApiProperty({ example: EXAMPLE_EMAIL })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 4, maxLength: 4, example: EXAMPLE_CODE })
    @IsString()
    @Length(4, 4)
    code: string;
}
