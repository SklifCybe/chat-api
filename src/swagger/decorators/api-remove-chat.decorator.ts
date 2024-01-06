import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiRemoveChat = () =>
    applyDecorators(
        ApiOperation({ summary: 'to delete chat' }),
        ApiNoContentResponse({ description: 'The chat was deleted.' }),
        ApiUnauthorizedResponse({
            type: ErrorResponse,
            description: 'User unauthorized.',
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'Chat was not removed.',
        }),
    );
