import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { UserNotFoundResponse } from '../../common/responses/user-not-found.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { CodeExpiredResponse } from '../../common/responses/code-expired.response';
import { IncorrectExpiredCodeConversationResponse } from '../../common/responses/incorrect-expired-code-conversation.response';
import {
    CODE_TO_EMAIL,
    PREVIOUS_CODE_STILL_EXIST,
    USER_NOT_FOUND_BY_EMAIl,
    INCORRECT_CONVERSATION_CODE,
} from '../../common/constants/swagger-description.constant';

export const ApiResponseNewCode = () =>
    applyDecorators(
        ApiOkResponse({ type: CodeExpiredResponse, description: CODE_TO_EMAIL }),
        ApiNotFoundResponse({ type: UserNotFoundResponse, description: USER_NOT_FOUND_BY_EMAIl }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: PREVIOUS_CODE_STILL_EXIST }),
        ApiInternalServerErrorResponse({
            type: IncorrectExpiredCodeConversationResponse,
            description: INCORRECT_CONVERSATION_CODE,
        }),
    );
