import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UserResponse } from '../../common/responses/user.response';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiResponseUserUpdate = () =>
    applyDecorators(
        ApiOperation({ summary: 'allows you to update some users fields: firstName, lastName and password' }),
        ApiOkResponse({ type: UserResponse, description: 'All passed user properties have been changed.' }),
        ApiNotFoundResponse({
            type: ErrorResponse,
            description:
                'Request body is empty, not valid user id, failed to update user dto or body validation throw exception.',
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description:
                'Request body is empty, not valid user id, failed to update user dto or body validation throw exception.',
        }),
    );
