import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { descriptions } from '../config.json';

const {
    user_logged_in_and_tokens_generated,
    user_not_found_password_not_match_users_email_not_confirmed,
    tokens_not_created_or_body_throw_exception,
} = descriptions;

export const ApiResponseSignIn = () =>
    applyDecorators(
        ApiCreatedResponse({ type: AccessTokenResponse, description: user_logged_in_and_tokens_generated }),
        ApiUnauthorizedResponse({
            type: UnauthorizedResponse,
            description: user_not_found_password_not_match_users_email_not_confirmed,
        }),
        ApiBadRequestResponse({
            type: IncorrectDataResponse,
            description: tokens_not_created_or_body_throw_exception,
        }),
    );
