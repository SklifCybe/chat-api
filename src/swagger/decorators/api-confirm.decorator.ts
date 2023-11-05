import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiConfirm = () =>
    applyDecorators(
        ApiOperation({ summary: 'to confirm the user, you need to enter the code from the mail' }),
        ApiCreatedResponse({ type: AccessTokenResponse, description: 'The user logged in and tokens were generated.' }),
        ApiUnauthorizedResponse({
            type: ErrorResponse,
            description: "Code expired, code doesn't match the one sent by email or user by email not found.",
        }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'Incorrect data or body validation throw exception.',
        }),
    );
