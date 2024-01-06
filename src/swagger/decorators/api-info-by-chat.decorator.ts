import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiUnauthorizedResponse,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses/error.response';
import { ChatResponse } from '../../common/responses/chat.response';

export const ApiInfoByChat = () =>
    applyDecorators(
        ApiOperation({ summary: 'for chat information' }),
        ApiOkResponse({ type: ChatResponse, description: 'Detailed information about the chat.' }),
        ApiNotFoundResponse({ type: ErrorResponse, description: 'Chat was not found.' }),
        ApiUnauthorizedResponse({
            type: ErrorResponse,
            description: 'User unauthorized.',
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'Incorrect data or body validation throw exception.',
        }),
    );
