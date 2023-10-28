import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessTokenResponse } from '../../common/responses/access-token.response';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { descriptions } from '../config.json';

const {
    user_logged_in_and_tokens_generated,
    code_expired_code_doesnt_match_the_one_sent_by_email_or_user_not_found,
    incorrect_data_or_body_throw_exception,
} = descriptions;

export const ApiResponseConfirm = () =>
    applyDecorators(
        ApiCreatedResponse({ type: AccessTokenResponse, description: user_logged_in_and_tokens_generated }),
        ApiUnauthorizedResponse({
            type: UnauthorizedResponse,
            description: code_expired_code_doesnt_match_the_one_sent_by_email_or_user_not_found,
        }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: incorrect_data_or_body_throw_exception }),
    );
