import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses/error.response';
import { PageResponse } from '../../common/responses/page.response';

export const ApiGetAllUsers = () =>
    applyDecorators(
        ApiOperation({ summary: 'all users with pagination' }),
        ApiOkResponse({ type: PageResponse, description: 'Success get users.' }),
        ApiUnauthorizedResponse({ type: ErrorResponse, description: 'User unauthorized.' }),
        ApiBadRequestResponse({
            type: ErrorResponse,
            description: 'Database throw exception on calculate count users or get all users.',
        }),
    );
