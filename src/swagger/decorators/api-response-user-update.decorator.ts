import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserResponse } from '../../common/responses/user.response';
import { UserNotFoundResponse } from '../../common/responses/user-not-found.response';
import { IncorrectDataResponse } from '../../common/responses/incorrect-data.response';
import { summary, descriptions } from '../config.json';

const {
    all_user_fields_changed,
    body_empty_or_failed_update_user_dto,
    user_not_found_by_id,
} = descriptions;

export const ApiResponseUserUpdate = () =>
    applyDecorators(
        ApiOperation({ summary: summary.user_profile_update }),
        ApiOkResponse({ type: UserResponse, description: all_user_fields_changed }),
        ApiNotFoundResponse({ type: UserNotFoundResponse, description: user_not_found_by_id }),
        ApiBadRequestResponse({
            type: IncorrectDataResponse,
            description: body_empty_or_failed_update_user_dto,
        }),
    );
