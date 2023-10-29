import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserNotFoundResponse } from '../../common/responses/user-not-found.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { CodeExpiredResponse } from '../../common/responses/code-expired.response';
import { IncorrectExpiredCodeConversationResponse } from '../../common/responses/incorrect-expired-code-conversation.response';
import { summary, descriptions } from '../config.json';

const {
    code_send_to_email,
    user_not_found_by_email,
    previous_code_still_exist_user_already_confirmed_body_throw_exception,
    incorrect_conversion_of_code_expired,
} = descriptions;

export const ApiResponseNewCode = () =>
    applyDecorators(
        ApiOperation({ summary: summary.auth_new_code }),
        ApiOkResponse({ type: CodeExpiredResponse, description: code_send_to_email }),
        ApiNotFoundResponse({ type: UserNotFoundResponse, description: user_not_found_by_email }),
        ApiBadRequestResponse({
            type: IncorrectDataResponse,
            description: previous_code_still_exist_user_already_confirmed_body_throw_exception,
        }),
        ApiInternalServerErrorResponse({
            type: IncorrectExpiredCodeConversationResponse,
            description: incorrect_conversion_of_code_expired,
        }),
    );
