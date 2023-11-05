import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses/error.response';
import { CodeExpiredResponse } from '../../common/responses/code-expired.response';

export const ApiNewCode = () =>
    applyDecorators(
        ApiOperation({ summary: 'allows you to request a new code' }),
        ApiOkResponse({ type: CodeExpiredResponse, description: 'Code will be send to email.' }),
        ApiNotFoundResponse({ type: ErrorResponse, description: 'User not found in database by email.' }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description:
                'The previous code still exists in redis, the user is already confirmed or body validation throw exception.',
        }),
        ApiInternalServerErrorResponse({
            type: ErrorResponse,
            description: 'Incorrect conversion of code expired.',
        }),
    );
