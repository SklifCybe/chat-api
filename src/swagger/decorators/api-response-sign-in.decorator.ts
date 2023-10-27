import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';

export const ApiResponseSignIn = () =>
    applyDecorators(
        ApiCreatedResponse({ type: AccessTokenResponse, description: 'The user logged in and tokens were generated.' }),
        ApiUnauthorizedResponse({
            type: UnauthorizedResponse,
            description:
                "User was not found in the system, the passwords do not match or user's email is not confirmed.",
        }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: 'Tokens could not be created or body validation throw exception.' }),
    );
