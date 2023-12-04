import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserResponse } from '../../common/responses/user.response';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiGetCurrentUser = () =>
    applyDecorators(
        ApiOperation({ summary: 'user info by userId in JWT' }),
        ApiOkResponse({ type: UserResponse, description: 'Current user.' }),
        ApiUnauthorizedResponse({ type: ErrorResponse, description: 'User unauthorized.' }),
        ApiNotFoundResponse({
            type: ErrorResponse,
            description: 'User not found in database. Maybe he will be deleted.',
        }),
    );
