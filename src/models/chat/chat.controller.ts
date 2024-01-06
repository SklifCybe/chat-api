import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { JwtPayload } from 'src/common/types/jwt.type';
import { User } from '../../common/decorators/user.decorator';
import { CHAT_NOT_CREATED, CHAT_NOT_FOUND } from '../../common/constants/error-messages.constant';
import { ChatResponse } from '../../common/responses/chat.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiInfoByChat } from '../../swagger/decorators/api-info-by-chat.decorator';
import { ApiCreateChat } from '../../swagger/decorators/api-create-chat.decorator';
import { ApiRemoveChat } from '../../swagger/decorators/api-remove-chat.decorator';

@ApiBearerAuth()
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiInfoByChat()
    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    public async getInfoByChat(@Param('id', ParseUUIDPipe) chatId: string): Promise<ChatResponse> {
        const chat = await this.chatService.findOneById(chatId);

        if (!chat) {
            throw new NotFoundException(CHAT_NOT_FOUND);
        }

        return new ChatResponse(chat);
    }

    @ApiCreateChat()
    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    public async create(@User() user: JwtPayload, @Body() createChatDto: CreateChatDto): Promise<ChatResponse> {
        const chat = await this.chatService.create(user.id, createChatDto);

        if (!chat) {
            throw new BadRequestException(CHAT_NOT_CREATED);
        }

        return new ChatResponse(chat);
    }

    @ApiRemoveChat()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    public async remove(@Param('id', ParseUUIDPipe) chatId: string): Promise<void> {
        const chat = await this.chatService.remove(chatId);

        if (!chat) {
            throw new BadRequestException();
        }
    }
}
