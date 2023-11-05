import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationConfigService } from '../../config/authentication/config.service';
import type { JwtPayload } from '../../common/types/jwt.type';
import { UserService } from '../../models/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authenticationConfigService: AuthenticationConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authenticationConfigService.secret,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        const user = await this.userService.findOneById(payload.id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
