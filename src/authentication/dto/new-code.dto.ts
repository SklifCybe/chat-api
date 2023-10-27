import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { EXAMPLE_EMAIL, EXAMPLE_FIRST_NAME, EXAMPLE_LAST_NAME } from '../../common/constants/swagger-example.constant';

export class NewCodeDto {
    @ApiProperty({ example: EXAMPLE_FIRST_NAME })
    @IsString()
    firstName: string;

    @ApiProperty({ example: EXAMPLE_LAST_NAME })
    @IsString()
    lastName: string;

    @ApiProperty({ example: EXAMPLE_EMAIL })
    @IsEmail()
    email: string;
}
