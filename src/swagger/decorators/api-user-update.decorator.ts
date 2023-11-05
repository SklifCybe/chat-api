import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiConsumes,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponse } from '../../common/responses/user.response';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiUserUpdate = () =>
    applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiOperation({ summary: 'allows you to update some users fields: firstName, lastName, password and avatar' }),
        ApiOkResponse({ type: UserResponse, description: 'All passed user properties have been changed.' }),
        ApiUnauthorizedResponse({ type: ErrorResponse, description: 'User unauthorized.' }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description:
                'Request body and file is empty, failed to update user by dto, failed load avatar, body or file validation throw exception.',
        }),
    );
