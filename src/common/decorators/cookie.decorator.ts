import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const Cookie = createParamDecorator((key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (key && key in request.cookies) {
        return request.cookies[key];
    }

    return null;
});
