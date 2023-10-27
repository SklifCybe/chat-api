import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { EXAMPLE_EMAIL, EXAMPLE_PASSWORD } from '../../common/constants/swagger-example.constant';

// todo: maybe delete this todos?
// todo: add inheritance from signUpDto. Use swagger pick or other method
// todo: after check correct validation on signInDto
export class SignInDto {
    @ApiProperty({ example: EXAMPLE_EMAIL })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ minLength: 6, example: EXAMPLE_PASSWORD })
    @IsString()
    @MinLength(6)
    public readonly password: string;
}
