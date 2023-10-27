import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { EmailConflictResponse } from '../../common/responses/email-conflict.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { UserResponse } from '../../common/responses/user.response';

export const ApiResponseSignUp = () =>
    applyDecorators(
        ApiCreatedResponse({ type: UserResponse, description: 'User has been add to database.' }),
        ApiConflictResponse({ type: EmailConflictResponse, description: 'User already exist in database.' }),
        ApiBadRequestResponse({ type: IncorrectDataResponse, description: 'Incorrect data or body validation throw exception.' }),
    );
