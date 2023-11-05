import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiRemoveUser = () =>
    applyDecorators(
        ApiOperation({ summary: 'delete the current, authorized user' }),
        ApiNoContentResponse({ description: 'User has been deleted.' }),
        ApiUnauthorizedResponse({
            type: ErrorResponse,
            description: 'User unauthorized.',
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'Failed to delete user.',
        }),
    );
