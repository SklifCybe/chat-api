import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

// todo: maybe delete this todos?
// todo: add inheritance from signUpDto. Use swagger pick or other method
// todo: after check correct validation on signInDto
export class SignInDto {
    @ApiProperty({ example: 'i.s.toaccept@gmail.com' })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ minLength: 6, example: '123456' })
    @IsString()
    @MinLength(6)
    public readonly password: string;
}
