import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const UserAgent = createParamDecorator((_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.headers['user-agent'];
});
