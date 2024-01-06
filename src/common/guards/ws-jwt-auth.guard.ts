import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationConfigService } from '../../config/authentication/config.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authenticationConfigService: AuthenticationConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const accessToken = this.extractTokenFromHeader(client);

        if (!accessToken) {
            throw new WsException('Unauthorized');
        }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.authenticationConfigService.secret,
            });

            client.user = payload;
        } catch (error) {
            throw new WsException('Unauthorized');
        }

        return true;
    }

    private extractTokenFromHeader(client: any): string | undefined {
        const [type, token] = client.handshake.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
