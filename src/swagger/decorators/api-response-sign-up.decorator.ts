import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiCreatedResponse,
    ApiConflictResponse,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { EmailConflictResponse } from '../../common/responses/email-conflict.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { CodeExpiredResponse } from '../../common/responses/code-expired.response';
import { IncorrectExpiredCodeConversationResponse } from '../../common/responses/incorrect-expired-code-conversation.response';
import { summary, descriptions } from '../config.json';

const {
    user_add_database_and_return_code_expired_time,
    user_already_exist,
    user_not_add_database_or_body_throw_exception,
    incorrect_conversion_of_code_expired,
} = descriptions;

export const ApiResponseSignUp = () =>
    applyDecorators(
        ApiOperation({ summary: summary.auth_sign_up }),
        ApiCreatedResponse({ type: CodeExpiredResponse, description: user_add_database_and_return_code_expired_time }),
        ApiConflictResponse({ type: EmailConflictResponse, description: user_already_exist }),
        ApiBadRequestResponse({
            type: IncorrectDataResponse,
            description: user_not_add_database_or_body_throw_exception,
        }),
        ApiInternalServerErrorResponse({
            type: IncorrectExpiredCodeConversationResponse,
            description: incorrect_conversion_of_code_expired,
        }),
    );
