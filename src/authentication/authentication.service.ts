import { compare } from 'bcrypt';
import type { Token, User } from '@prisma/client';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import type { SignUpDto } from './dto/sign-up.dto';
import type { SignInDto } from './dto/sign-in.dto';
import type { Tokens } from '../common/interfaces/tokens.interface';
import { USER_HAS_BEEN_DELETED, WRONG_EMAIL_OR_PASSWORD } from '../common/constants/error-messages.constant';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationRepository } from './authentication.repository';
import { AuthenticationConfigService } from '../config/authentication/config.service';

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly authenticationRepository: AuthenticationRepository,
        private readonly authenticationConfigService: AuthenticationConfigService,
    ) {}

    public async signUp(signUpDto: SignUpDto): Promise<User | null> {
        try {
            return this.userService.create(signUpDto);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async signIn(signInDto: SignInDto, userAgent: string): Promise<Tokens | null> {
        try {
            const user = await this.userService.findOneByEmail(signInDto.email);

            if (!user) {
                throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
            }

            const isPasswordsMatched = await compare(signInDto.password, user.password);

            if (!isPasswordsMatched) {
                throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
            }

            const tokens = await this.generateTokens(user.id, user.email, userAgent);

            return tokens;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async signOut(refreshToken: string): Promise<Token> {
        return this.authenticationRepository.removeRefreshToken(refreshToken);
    }

    public async refreshTokens(refreshToken: string, userAgent: string): Promise<Tokens> {
        const token = await this.authenticationRepository.getRefreshToken({ token: refreshToken });

        if (!token) {
            throw new UnauthorizedException();
        }

        await this.authenticationRepository.removeRefreshToken(refreshToken);

        if (new Date(token.expired) < new Date()) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.findOneById(token.userId);

        if (!user) {
            throw new UnauthorizedException(USER_HAS_BEEN_DELETED);
        }

        const tokens = await this.generateTokens(user.id, user.email, userAgent);

        return tokens;
    }

    private async generateTokens(id: string, email: string, userAgent: string): Promise<Tokens> {
        const secret = this.authenticationConfigService.secret;
        const accessToken = await this.jwtService.signAsync({ id, email }, { secret });
        const refreshToken = await this.authenticationRepository.getRefreshToken({ token: undefined, userId: id, userAgent });

        // todo: maybe create upsert method in prisma
        if (!refreshToken) {
            const newRefreshToken = await this.authenticationRepository.createRefreshToken(id, userAgent);
            return this.generateJsonForTokens(accessToken, newRefreshToken);
        } else {
            const oldRefreshToken = await this.authenticationRepository.updateRefreshToken(refreshToken.token);
            return this.generateJsonForTokens(accessToken, oldRefreshToken);
        }
    }

    private generateJsonForTokens(accessToken: string, refreshToken: Token): Tokens {
        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken,
        };
    }
}
