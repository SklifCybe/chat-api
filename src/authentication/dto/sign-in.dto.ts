import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { examples } from '../../swagger/config.json';

const { email, password } = examples;

// todo: maybe delete this todos?
// todo: add inheritance from signUpDto. Use swagger pick or other method
// todo: after check correct validation on signInDto
export class SignInDto {
    @ApiProperty({ example: email })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ minLength: 6, example: password })
    @IsString()
    @MinLength(6)
    public readonly password: string;
}
