import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { USER_LOGGED_IN, INCORRECT_DATA, CODE_UNAUTHORIZED } from '../../common/constants/swagger-description.constant';

export const ApiResponseConfirm = () =>
    applyDecorators(
        ApiCreatedResponse({ type: AccessTokenResponse, description: USER_LOGGED_IN }),
        ApiUnauthorizedResponse({
            type: UnauthorizedResponse,
            description: CODE_UNAUTHORIZED,
        }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: INCORRECT_DATA }),
    );
