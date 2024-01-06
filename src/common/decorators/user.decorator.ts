import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import type { JwtPayload } from '../types/jwt.type';
import type { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

export const User = createParamDecorator((_, context: ExecutionContext): JwtPayload => {
    const isHttp = context.getType() === 'http';
    const isWs = context.getType() === 'ws';

    if (isHttp) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException();
        }

        return user as JwtPayload;
    }

    if (isWs) {
        const client = context.switchToWs().getClient<Socket>();
        const user = (client as any).user;

        if (!user) {
            throw new WsException('Unauthorized');
        }

        return user as JwtPayload;
    }

    throw new Error('Unsupported context type');
});
