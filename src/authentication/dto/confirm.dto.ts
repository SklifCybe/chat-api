import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(4, 4)
    code: number;
}
