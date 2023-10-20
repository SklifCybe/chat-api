import { IsString, IsEmail } from 'class-validator';

export class NewCodeDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;
}
