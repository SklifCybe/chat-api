import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNumberString } from 'class-validator';
import { EXAMPLE_EMAIL, EXAMPLE_CODE } from '../../common/constants/swagger-example.constant';

export class ConfirmDto {
    @ApiProperty({ example: EXAMPLE_EMAIL })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ minLength: 4, maxLength: 4, example: EXAMPLE_CODE })
    @IsNumberString()
    @Length(4, 4)
    public readonly code: string;
}
