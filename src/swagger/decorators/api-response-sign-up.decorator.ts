import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiCreatedResponse,
    ApiConflictResponse,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CodeExpiredResponse } from '../../common/responses/code-expired.response';
import { ErrorResponse } from '../../common/responses/error.response';

export const ApiResponseSignUp = () =>
    applyDecorators(
        ApiOperation({ summary: 'registration, after which an email with a code will be sent' }),
        ApiCreatedResponse({
            type: CodeExpiredResponse,
            description: 'User has been add to database and return code expired time.',
        }),
        ApiConflictResponse({ type: ErrorResponse, description: 'User already exist in database.' }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'User not added to database or body validation throw exception.',
        }),
        ApiInternalServerErrorResponse({
            type: ErrorResponse,
            description: 'Incorrect conversion of code expired.',
        }),
    );
