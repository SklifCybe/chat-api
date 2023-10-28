import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Validate, Length } from 'class-validator';
import { IsEmailUnique } from '../../common/decorators/is-email-unique.decorator';
import { IsPasswordsMatchingConstrains } from '../../common/decorators/is-passwords-matching-constrains.decorator';
import { examples } from '../../swagger/config.json';

const { first_name, last_name, email, password } = examples;

export class SignUpDto {
    @ApiProperty({ minLength: 2, maxLength: 20, example: first_name })
    @IsString()
    @Length(2, 20)
    // todo: add constant messages to error for all decorators in all dto files
    public readonly firstName: string;

    @ApiProperty({ minLength: 2, maxLength: 20, example: last_name })
    @IsString()
    @Length(2, 20)
    public readonly lastName: string;

    @ApiProperty({ uniqueItems: true, example: email })
    @IsEmail()
    @IsEmailUnique()
    public readonly email: string;

    @ApiProperty({ minLength: 6, example: password })
    @IsString()
    @MinLength(6)
    public readonly password: string;

    @ApiProperty({ minLength: 6, example: password })
    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstrains)
    public readonly confirmPassword: string;
}
