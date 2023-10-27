import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import {
    USER_LOGGED_IN,
    TOKENS_NOT_CREATED,
    USER_NOT_FOUND,
} from '../../common/constants/swagger-description.constant';

export const ApiResponseSignIn = () =>
    applyDecorators(
        ApiCreatedResponse({ type: AccessTokenResponse, description: USER_LOGGED_IN }),
        ApiUnauthorizedResponse({
            type: UnauthorizedResponse,
            description: USER_NOT_FOUND,
        }),
        ApiBadRequestResponse({
            type: IncorrectDataResponse,
            description: TOKENS_NOT_CREATED,
        }),
    );