import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { EmailConflictResponse } from '../../common/responses/email-conflict.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { UserResponse } from '../../common/responses/user.response';
import {
    USER_ADD_DATABASE,
    USER_ALREADY_EXIST,
    INCORRECT_DATA,
} from '../../common/constants/swagger-description.constant';

export const ApiResponseSignUp = () =>
    applyDecorators(
        ApiCreatedResponse({ type: UserResponse, description: USER_ADD_DATABASE }),
        ApiConflictResponse({ type: EmailConflictResponse, description: USER_ALREADY_EXIST }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: INCORRECT_DATA }),
    );
