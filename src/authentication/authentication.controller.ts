import { Response } from 'express';
import {
    Controller,
    Post,
    Get,
    Body,
    BadRequestException,
    UnauthorizedException,
    Res,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpStatus,
    Delete,
    Put,
    Logger,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthenticationService } from './authentication.service';
import { unableToRegisterUserError, unableToEnterError, unableToSendAnEmail } from '../common/helpers/error-message.helper';
import type { Tokens } from '../common/interfaces/tokens.interface';
import { REFRESH_TOKEN } from '../common/constants/token.constant';
import { ApplicationConfigService } from '../config/application/config.service';
import { Cookie } from '../common/decorators/cookie.decorator';
import { UserAgent } from '../common/decorators/user-agent.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserResponse } from '../common/response/user.response';
import { ConfirmDto } from './dto/confirm.dto';
import { NewCodeDto } from './dto/new-code.dto';

@Controller('auth')
export class AuthenticationController {
    private readonly logger = new Logger(AuthenticationController.name);
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly applicationConfigService: ApplicationConfigService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Public()
    @Post('sign-up')
    public async signUp(@Body() signUpDto: SignUpDto): Promise<UserResponse> {
        const user = await this.authenticationService.signUp(signUpDto);
        if (!user) {
            throw new BadRequestException(unableToRegisterUserError(JSON.stringify(signUpDto)));
        }
        return new UserResponse(user);
    }

    @Public()
    @Post('sign-in')
    public async signIn(
        @Body() signInDto: SignInDto,
        @Res({ passthrough: true }) response: Response,
        @UserAgent() userAgent: string,
    ): Promise<{ accessToken: string }> {
        const tokens = await this.authenticationService.signIn(signInDto, userAgent);
        if (!tokens) {
            throw new BadRequestException(unableToEnterError(JSON.stringify(signInDto)));
        }

        this.setRefreshTokenToCookies(tokens, response);

        return { accessToken: tokens.accessToken };
    }

    @Public()
    @Post('confirm')
    public async confirm(
        @Res({ passthrough: true }) response: Response,
        @UserAgent() userAgent: string,
        @Body() confirmDto: ConfirmDto,
    ): Promise<{ accessToken: string }> {
        const tokens = await this.authenticationService.confirm(confirmDto, userAgent);

        if (!tokens) {
            throw new BadRequestException(unableToEnterError(JSON.stringify(confirmDto)));
        }

        this.setRefreshTokenToCookies(tokens, response);

        return { accessToken: tokens.accessToken };
    }

    @Public()
    @Put('new-code')
    public async newCode(@Body() newCodeDto: NewCodeDto): Promise<HttpStatus> {
        try {
            await this.authenticationService.newCode(newCodeDto);
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(unableToSendAnEmail(newCodeDto.email));
        }
         
        return HttpStatus.NO_CONTENT;
    }

    @Get('refresh-tokens')
    public async refreshTokens(
        @Cookie(REFRESH_TOKEN) refreshToken: string,
        @Res({ passthrough: true }) response: Response,
        @UserAgent() userAgent: string,
    ): Promise<Tokens> {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const tokens = await this.authenticationService.refreshTokens(refreshToken, userAgent);
        this.setRefreshTokenToCookies(tokens, response);

        return tokens;
    }

    @Delete('sign-out')
    public async signOut(
        @Cookie(REFRESH_TOKEN) refreshToken: string,
        @Res({ passthrough: true }) response: Response,
    ): Promise<HttpStatus> {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        await this.authenticationService.signOut(refreshToken);
        response.clearCookie(REFRESH_TOKEN);

        return HttpStatus.NO_CONTENT;
    }

    private setRefreshTokenToCookies(tokens: Tokens, response: Response): void {
        if (!tokens.refreshToken) {
            throw new UnauthorizedException();
        }
        response.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.expired),
            secure: this.applicationConfigService.isProduction,
            path: '/',
        });
    }
}
