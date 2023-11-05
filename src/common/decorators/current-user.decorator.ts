import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { JwtPayload } from '../types/jwt.type';

export const CurrentUser = createParamDecorator(
    (key: keyof JwtPayload, context: ExecutionContext): JwtPayload | Partial<JwtPayload> => {
        const request = context.switchToHttp().getRequest();

        return key ? request.user[key] : request.user;
    },
);
