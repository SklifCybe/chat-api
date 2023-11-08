import { compare } from 'bcrypt';
import type { Token } from '@prisma/client';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import type { SignUpDto } from './dto/sign-up.dto';
import type { SignInDto } from './dto/sign-in.dto';
import type { Tokens } from '../common/types/tokens.type';
import {
    INCORRECT_VERIFICATION_CODE,
    USER_HAS_BEEN_DELETED,
    WRONG_EMAIL_OR_PASSWORD,
    CODE_EXPIRED,
    EMAIL_NOT_CONFIRMED,
    USER_ALREADY_CONFIRMED,
    PREVIOUS_CODE,
    USER_NOT_FOUND,
    INCORRECT_DATA,
} from '../common/constants/error-messages.constant';
import { AuthenticationConfigService } from '../config/authentication/config.service';
import { MailService } from '../models/mail/mail.service';
import { createConfirmCode } from '../common/utils/create-confirm-code';
import type { ConfirmDto } from './dto/confirm.dto';
import { CacheManagerService } from '../models/cache-manager/cache-manager.service';
import type { ConfirmTime } from '../common/types/time.type';
import { codeConfirmTime } from '../common/utils/code-confirm-time';
import { TokensService } from '../models/tokens/tokens.service';

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    constructor(
        private readonly userService: UserService,
        private readonly authenticationConfigService: AuthenticationConfigService,
        private readonly mailService: MailService,
        private readonly cacheManagerService: CacheManagerService,
        private readonly tokensService: TokensService
    ) {}

    public async signUp(signUpDto: SignUpDto): Promise<ConfirmTime | null> {
        try {
            const { firstName, lastName, email } = signUpDto;
            const code = createConfirmCode();
            const confirmTime = this.authenticationConfigService.confirmTime;
            const confirmCodeExpired = codeConfirmTime(confirmTime);

            if (!confirmCodeExpired) {
                throw new Error();
            }

            this.sendCodeToEmail(email, code, confirmCodeExpired.seconds, { firstName, lastName });
            const user = await this.userService.create(signUpDto);

            if (!user) {
                throw new BadRequestException(INCORRECT_DATA);
            }

            return confirmCodeExpired;
        } catch (error) {
            this.logger.error(error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            return null;
        }
    }

    public async signIn(signInDto: SignInDto, userAgent: string): Promise<Tokens | null> {
        try {
            const user = await this.userService.findOneByEmail(signInDto.email);

            if (!user) {
                // todo: change to user not registered
                throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
            }

            const isPasswordsMatched = await compare(signInDto.password, user.password);

            if (!isPasswordsMatched) {
                throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
            }

            if (!user.mailConfirmed) {
                throw new UnauthorizedException(EMAIL_NOT_CONFIRMED);
            }

            return this.tokensService.generateTokens(user.id, user.email, userAgent);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            return null;
        }
    }

    public async signOut(refreshToken: string): Promise<Token | null> {
        return this.tokensService.removeRefreshToken(refreshToken);
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
            await this.cacheManagerService.delCodeConfirm(user.email);

            this.mailService.sendSuccessfulSignUp(user.email);

            return this.tokensService.generateTokens(user.id, user.email, userAgent);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
                throw error;
            }

            return null;
        }
    }

    public async newCode(email: string): Promise<ConfirmTime | null> {
        try {
            const codeFromCache = await this.cacheManagerService.getCodeConfirm(email);
            const user = await this.userService.findOneByEmail(email);
            const code = createConfirmCode();
            const confirmTime = this.authenticationConfigService.confirmTime;
            const confirmCodeExpired = codeConfirmTime(confirmTime);

            if (!confirmCodeExpired) {
                throw new Error();
            }

            if (!user) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            if (codeFromCache) {
                throw new BadRequestException(PREVIOUS_CODE);
            }

            if (user.mailConfirmed) {
                throw new BadRequestException(USER_ALREADY_CONFIRMED);
            }

            this.sendCodeToEmail(email, code, confirmCodeExpired.seconds);

            return confirmCodeExpired;
        } catch (error) {
            this.logger.error(error);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            return null;
        }
    }
    
    // todo: this method make double request to db for get token
    public async refreshTokens(refreshToken: string, userAgent: string): Promise<Tokens | null> {
        try {
            const token = await this.tokensService.getRefreshToken({ token: refreshToken });

            if (!token) {
                throw new UnauthorizedException();
            }

            await this.tokensService.removeRefreshToken(refreshToken);

            if (new Date(token.expired) < new Date()) {
                throw new UnauthorizedException();
            }

            const user = await this.userService.findOneById(token.userId);

            if (!user) {
                // todo: maybe it BadRequestException or other
                // todo: think about message
                throw new UnauthorizedException(USER_HAS_BEEN_DELETED);
            }

            return this.tokensService.generateTokens(user.id, user.email, userAgent);
        } catch (error) {
            this.logger.error(error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            return null;
        }
    }

    private async sendCodeToEmail(
        email: string,
        code: string,
        ttl: number,
        userInfo?: { firstName: string; lastName: string },
    ): Promise<void> {
        await this.cacheManagerService.setCodeConfirm(email, code, ttl);

        if (userInfo) {
            await this.mailService.sendConfirmationCode(userInfo.firstName, userInfo.lastName, email, code);
        } else {
            await this.mailService.sendNewConfirmationCode(email, code);
        }
    }
}
