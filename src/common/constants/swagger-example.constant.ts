import type { Time } from '../interfaces/time.interface';
import { WRONG_EMAIL_OR_PASSWORD, INCORRECT_DATA, USER_NOT_FOUND, INCORRECT_CODE_CONVERT } from './error-messages.constant';

// todo: remove all swagger constants (examples, descriptions) and create swagger-config.json file. he must contain all examples and descriptions

export const EXAMPLE_FIRST_NAME = 'Ilya';
export const EXAMPLE_LAST_NAME = 'Strelkovskiy';
export const EXAMPLE_EMAIL = 'i.s.toaccept@gmail.com';
export const EXAMPLE_PASSWORD = 'password';
export const EXAMPLE_CODE = '1234';
export const EXAMPLE_UUID = '5779afb5-d3de-4434-9bab-92625270e530';
export const EXAMPLE_UPDATE_AT = '2023-10-26T16:48:29.355Z';
export const EXAMPLE_WRONG_EMAIL_OR_PASSWORD = WRONG_EMAIL_OR_PASSWORD;
export const EXAMPLE_INCORRECT_DATA = INCORRECT_DATA;
export const EXAMPLE_USER_NOT_FOUND = USER_NOT_FOUND;
export const EXAMPLE_INTERNAL_SERVER_ERROR = INCORRECT_CODE_CONVERT;
export const EXAMPLE_ERROR_NAME_UNAUTHORIZED = 'Unauthorized';
export const EXAMPLE_ERROR_NAME_BAD_REQUEST = 'Bad Request';
export const EXAMPLE_ERROR_NAME_CONFLICT = 'Conflict';
export const EXAMPLE_ERROR_NAME_NOT_FOUND = 'Not Found';
export const EXAMPLE_ERROR_NAME_INTERNAL_SERVER_ERROR = 'Internal Server Error';
export const EXAMPLE_ERROR_CODE_UNAUTHORIZED = 401;
export const EXAMPLE_ERROR_CODE_BAD_REQUEST = 400;
export const EXAMPLE_ERROR_CODE_CONFLICT = 409;
export const EXAMPLE_ERROR_CODE_NOT_FOUND = 404;
export const EXAMPLE_ERROR_CODE_INTERNAL_SERVER_ERROR = 500;
export const EXAMPLE_EMAIL_ALREADY_EXIST = `Email ${EXAMPLE_EMAIL} - already exist`;
export const EXAMPLE_CODE_EXPIRED: Time['confirmTime'] = {
    seconds: 60,
    milliseconds: 60000,
};
