import { IsString, IsEmail, MinLength } from 'class-validator';

// todo: add inheritance from signUpDto. Use swagger pick or other method.
// todo: after check correct validation on signInDto
export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}