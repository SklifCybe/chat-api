import { compare } from 'bcrypt';
import type { Token, User } from '@prisma/client';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import type { SignUpDto } from './dto/sign-up.dto';
import type { SignInDto } from './dto/sign-in.dto';
import type { Tokens } from '../common/interfaces/tokens.interface';
import {
    INCORRECT_VERIFICATION_CODE,
    USER_HAS_BEEN_DELETED,
    WRONG_EMAIL_OR_PASSWORD,
    CODE_EXPIRED,
    EMAIL_NOT_CONFIRMED,
    USER_ALREADY_CONFIRMED,
    PREVIOUS_CODE,
    USER_NOT_FOUND,
} from '../common/constants/error-messages.constant';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationRepository } from './authentication.repository';
import { AuthenticationConfigService } from '../config/authentication/config.service';
import { MailService } from '../models/mail/mail.service';
import { createConfirmCode } from '../common/utils/create-confirm-code';
import type { ConfirmDto } from './dto/confirm.dto';
import { CacheManagerService } from '../models/cache-manager/cache-manager.service';
import type { NewCodeDto } from './dto/new-code.dto';

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly authenticationRepository: AuthenticationRepository,
        private readonly authenticationConfigService: AuthenticationConfigService,
        private readonly mailService: MailService,
        private readonly cacheManagerService: CacheManagerService,
    ) {}

    public async signUp(signUpDto: SignUpDto): Promise<User | null> {
        try {
            const { firstName, lastName, email } = signUpDto;
            const code = createConfirmCode();

            await this.sendCodeToEmail(email, code, { firstName, lastName });

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

            if (!user.mailConfirmed) {
                throw new UnauthorizedException(EMAIL_NOT_CONFIRMED);
            }

            return this.generateTokens(user.id, user.email, userAgent);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            return null;
        }
    }

    public async signOut(refreshToken: string): Promise<Token> {
        return this.authenticationRepository.removeRefreshToken(refreshToken);
    }

    public async confirm(confirmDto: ConfirmDto, userAgent: string): Promise<Tokens | null> {
        try {
            const codeFromCache = await this.cacheManagerService.getCodeConfirm(confirmDto.email);
            const user = await this.userService.findOneByEmail(confirmDto.email);

            if (!user) {
                throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
            }

            if (user.mailConfirmed) {
                throw new BadRequestException(USER_ALREADY_CONFIRMED);
            }

            if (!codeFromCache) {
                throw new UnauthorizedException(CODE_EXPIRED);
            }

            if (confirmDto.code !== codeFromCache) {
                throw new UnauthorizedException(INCORRECT_VERIFICATION_CODE);
            }

            await this.userService.confirm(user.id);
            await this.mailService.sendSuccessfulSignUp(user.email);

            return this.generateTokens(user.id, user.email, userAgent);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
                throw error;
            }

            return null;
        }
    }

    public async newCode(newCodeDto: NewCodeDto): Promise<void> {
        try {
            const { email } = newCodeDto;
            const codeFromCache = await this.cacheManagerService.getCodeConfirm(email);
            const user = await this.userService.findOneByEmail(email);
            const code = createConfirmCode();

            if (!user) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            if (codeFromCache) {
                throw new BadRequestException(PREVIOUS_CODE);
            }

            if (user.mailConfirmed) {
                throw new BadRequestException(USER_ALREADY_CONFIRMED);
            }

            await this.sendCodeToEmail(email, code);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
        }
    }

    public async refreshTokens(refreshToken: string, userAgent: string): Promise<Tokens | null> {
        try {
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

            return this.generateTokens(user.id, user.email, userAgent);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            return null;
        }
    }

    private async generateTokens(id: string, email: string, userAgent: string): Promise<Tokens> {
        const secret = this.authenticationConfigService.secret;
        const accessToken = await this.jwtService.signAsync({ id, email }, { secret });
        const refreshToken = await this.authenticationRepository.getRefreshToken({
            token: undefined,
            userId: id,
            userAgent,
        });

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

    private async sendCodeToEmail(
        email: string,
        code: string,
        userInfo?: { firstName: string; lastName: string },
    ): Promise<void> {
        await this.cacheManagerService.setCodeConfirm(email, code);

        if (userInfo) {
            await this.mailService.sendConfirmationCode(userInfo.firstName, userInfo.lastName, email, code);
        } else {
            await this.mailService.sendNewConfirmationCode(email, code);
        }
    }
}
