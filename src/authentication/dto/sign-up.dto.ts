import { IsString, IsEmail, MinLength, Validate, Length } from 'class-validator';
import { IsEmailUnique } from '../../common/decorators/is-email-unique.decorator';
import { IsPasswordsMatchingConstrains } from '../../common/decorators/is-passwords-matching-constrains.decorator';

export class SignUpDto {
    @IsString()
    @Length(2, 20)
    firstName: string;

    @IsString()
    @Length(2, 20)
    lastName: string;

    @IsEmail()
    @IsEmailUnique()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstrains)
    confirmPassword: string;
}
