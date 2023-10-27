import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UserNotFoundResponse } from '../../common/responses/user-not-found.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import {
    CODE_TO_EMAIL,
    PREVIOUS_CODE_STILL_EXIST,
    USER_NOT_FOUND_BY_EMAIl,
} from '../../common/constants/swagger-description.constant';

export const ApiResponseNewCode = () =>
    applyDecorators(
        ApiNoContentResponse({ description: CODE_TO_EMAIL }),
        ApiNotFoundResponse({ type: UserNotFoundResponse, description: USER_NOT_FOUND_BY_EMAIl }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: PREVIOUS_CODE_STILL_EXIST }),
    );
