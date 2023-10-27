import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Validate, Length } from 'class-validator';
import { IsEmailUnique } from '../../common/decorators/is-email-unique.decorator';
import { IsPasswordsMatchingConstrains } from '../../common/decorators/is-passwords-matching-constrains.decorator';

export class SignUpDto {
    @ApiProperty({ minLength: 2, maxLength: 20, example: 'Ilya' })
    @IsString()
    @Length(2, 20)
    firstName: string;

    @ApiProperty({ minLength: 2, maxLength: 20, example: 'Strelkovskiy' })
    @IsString()
    @Length(2, 20)
    lastName: string;

    @ApiProperty({ uniqueItems: true, example: 'i.s.toaccept@gmail.com' })
    @IsEmail()
    @IsEmailUnique()
    email: string;

    @ApiProperty({ minLength: 6, example: 'password' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ minLength: 6, example: 'password' })
    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstrains)
    confirmPassword: string;
}
