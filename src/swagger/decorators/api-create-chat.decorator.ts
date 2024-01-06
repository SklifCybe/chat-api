import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses/error.response';
import { ChatResponse } from '../../common/responses/chat.response';

export const ApiCreateChat = () =>
    applyDecorators(
        ApiOperation({ summary: 'to create a new chat' }),
        ApiCreatedResponse({ type: ChatResponse, description: 'New chat.' }),
        ApiUnauthorizedResponse({
            type: ErrorResponse,
            description: 'User unauthorized.',
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'The chat was not created. Reasons: chat with these users already exists or error with the database.',
        }),
    );
