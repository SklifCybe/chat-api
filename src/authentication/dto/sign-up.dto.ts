import { IsString, IsEmail, MinLength, Validate } from 'class-validator';
import { IsEmailUnique } from '../../common/decorators/is-email-unique.decorator';
import { IsPasswordsMatchingConstrains } from '../../common/decorators/is-passwords-matching-constrains.decorator';

export class SignUpDto {
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
