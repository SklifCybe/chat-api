import type { ExecutionContext, CanActivate } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { JWT, IS_PUBLIC_KEY } from '../constants/jwt.constant';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationConfigService } from '../../config/authentication/config.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT) implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly authenticationConfigService: AuthenticationConfigService,
    ) {
        super();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);

        if (!accessToken) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.authenticationConfigService.secret,
            });

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    // todo: duplicate
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
