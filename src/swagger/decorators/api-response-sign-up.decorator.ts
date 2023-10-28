import { applyDecorators } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiConflictResponse,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { EmailConflictResponse } from '../../common/responses/email-conflict.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { CodeExpiredResponse } from '../../common/responses/code-expired.response';
import { IncorrectExpiredCodeConversationResponse } from '../../common/responses/incorrect-expired-code-conversation.response';
import {
    USER_ADD_DATABASE,
    USER_ALREADY_EXIST,
    USER_NOT_ADD_DATABASE,
    INCORRECT_CONVERSATION_CODE,
} from '../../common/constants/swagger-description.constant';

export const ApiResponseSignUp = () =>
    applyDecorators(
        ApiCreatedResponse({ type: CodeExpiredResponse, description: USER_ADD_DATABASE }),
        ApiConflictResponse({ type: EmailConflictResponse, description: USER_ALREADY_EXIST }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: USER_NOT_ADD_DATABASE }),
        ApiInternalServerErrorResponse({
            type: IncorrectExpiredCodeConversationResponse,
            description: INCORRECT_CONVERSATION_CODE,
        }),
    );
