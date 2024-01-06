import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '@prisma/client';
import { IsEnum, IsString, IsUUID, Length } from 'class-validator';

export class CreateChatDto {
    @ApiProperty({ minLength: 3, maxLength: 20, example: 'Chat Tittle' })
    @IsString()
    @Length(3, 20)
    public readonly title: string;

    @ApiProperty({ enum: ChatType, example: ChatType.Direct, default: ChatType.Direct })
    @IsEnum(ChatType)
    public readonly type: ChatType = ChatType.Direct;

    @ApiProperty({ example: '5779afb5-d3de-4434-9bab-92625270e530' })
    @IsUUID()
    public readonly participantId: string;
}
