import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, MinLength, IsOptional } from 'class-validator';
import { File } from '../../../common/types/file.type';
import { IsUserNameUnique } from '../../../common/decorators/is-user-name-unique.decorator';

export class UpdateUserDto {
    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: 'Ilya' })
    @IsOptional()
    @IsString()
    @Length(2, 20)
    public readonly firstName?: string;

    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: 'Strelkovskiy' })
    @IsOptional()
    @IsString()
    @Length(2, 20)
    public readonly lastName?: string;

    @ApiPropertyOptional({ minLength: 6, example: '123456' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    public readonly password?: string;

    @ApiPropertyOptional({ type: 'file' })
    @IsOptional()
    // todo: add validation for file. should create custom decorator something like this
    // https://stackoverflow.com/questions/60680641/is-there-any-way-to-implement-validation-for-file-upload-using-class-validator
    // maybe else
    public readonly file?: File;

    @ApiPropertyOptional({ minLength: 3, maxLength: 15, example: 'sklif' })
    @IsOptional()
    @IsUserNameUnique()
    @IsString()
    @Length(3, 15)
    public readonly userName?: string;
}
