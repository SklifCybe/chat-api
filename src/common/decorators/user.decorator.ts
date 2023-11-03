import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import type { JwtPayload } from '../interfaces/jwt.interface';

export const User = createParamDecorator((_, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
        throw new UnauthorizedException();
    }

    return request.user as JwtPayload;
});
