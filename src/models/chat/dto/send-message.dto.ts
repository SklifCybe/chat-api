import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class SendMessageDto {
    @ApiProperty({ minLength: 1, example: 'Hello world!' })
    @IsString()
    @MinLength(1)
    public readonly content: string;

    @ApiProperty({ example: '5779afb5-d3de-4434-9bab-92625270e530' })
    @IsUUID()
    public readonly chatId: string;
}
