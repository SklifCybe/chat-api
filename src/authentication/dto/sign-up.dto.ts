import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Validate, Length } from 'class-validator';
import { IsEmailUnique } from '../../common/decorators/is-email-unique.decorator';
import {
    EXAMPLE_EMAIL,
    EXAMPLE_FIRST_NAME,
    EXAMPLE_LAST_NAME,
    EXAMPLE_PASSWORD,
} from '../../common/constants/swagger-example.constant';
import { IsPasswordsMatchingConstrains } from '../../common/decorators/is-passwords-matching-constrains.decorator';

export class SignUpDto {
    @ApiProperty({ minLength: 2, maxLength: 20, example: EXAMPLE_FIRST_NAME })
    @IsString()
    @Length(2, 20)
    // todo: add constant messages to error for all decorators in all dto files
    public readonly firstName: string;

    @ApiProperty({ minLength: 2, maxLength: 20, example: EXAMPLE_LAST_NAME })
    @IsString()
    @Length(2, 20)
    public readonly lastName: string;

    @ApiProperty({ uniqueItems: true, example: EXAMPLE_EMAIL })
    @IsEmail()
    @IsEmailUnique()
    public readonly email: string;

    @ApiProperty({ minLength: 6, example: EXAMPLE_PASSWORD })
    @IsString()
    @MinLength(6)
    public readonly password: string;

    @ApiProperty({ minLength: 6, example: EXAMPLE_PASSWORD })
    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstrains)
    public readonly confirmPassword: string;
}
