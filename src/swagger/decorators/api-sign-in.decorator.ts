import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiSignIn = () =>
    applyDecorators(
        ApiOperation({ summary: 'login' }),
        ApiCreatedResponse({ type: AccessTokenResponse, description: 'The user logged in and tokens were generated.' }),
        ApiUnauthorizedResponse({
            type: ErrorResponse,
            description:
                "User was not found in the system, the passwords do not match or user's email is not confirmed.",
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'Tokens could not be created or body validation throw exception.',
        }),
    );
