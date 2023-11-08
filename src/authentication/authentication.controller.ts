import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UnauthorizedException,
    Res,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpStatus,
    Delete,
    HttpCode,
    Query,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthenticationService } from './authentication.service';
import type { Tokens } from '../common/types/tokens.type';
import { REFRESH_TOKEN } from '../common/constants/jwt.constant';
import { ApplicationConfigService } from '../config/application/config.service';
import { Cookie } from '../common/decorators/cookie.decorator';
import { UserAgent } from '../common/decorators/user-agent.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CodeExpiredResponse } from '../common/responses/code-expired.response';
import { ConfirmDto } from './dto/confirm.dto';
import { NewCodeDto } from './dto/new-code.dto';
import { AuthenticationConfigService } from '../config/authentication/config.service';
import { INCORRECT_DATA, INCORRECT_CODE_CONVERT } from '../common/constants/error-messages.constant';
import { ApiSignUp } from '../swagger/decorators/api-sign-up.decorator';
import { ApiSignIn } from '../swagger/decorators/api-sign-in.decorator';
import { ApiConfirm } from '../swagger/decorators/api-confirm.decorator';
import { ApiNewCode } from '../swagger/decorators/api-new-code.decorator';
import { AccessTokenResponse } from '../common/responses/access-token.response';
import { convertTime } from '../common/utils/convert-time';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
    private readonly logger = new Logger();

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly applicationConfigService: ApplicationConfigService,
        private readonly authenticationConfigService: AuthenticationConfigService,
    ) {}

    @ApiSignUp()
    @UseInterceptors(ClassSerializerInterceptor)
    @Public()
    @Post('sign-up')
    public async signUp(@Body() signUpDto: SignUpDto): Promise<CodeExpiredResponse> {
        const confirmTime = await this.authenticationService.signUp(signUpDto);

        if (!confirmTime) {
            throw new InternalServerErrorException(INCORRECT_CODE_CONVERT);
        }

        return new CodeExpiredResponse(confirmTime);
    }

    @ApiSignIn()
    @Public()
    @Post('sign-in')
    public async signIn(
        @Body() signInDto: SignInDto,
        @Res({ passthrough: true }) response: Response,
        @UserAgent() userAgent: string,
    ): Promise<AccessTokenResponse> {
        const tokens = await this.authenticationService.signIn(signInDto, userAgent);

        if (!tokens) {
            throw new BadRequestException(INCORRECT_DATA);
        }

        this.setRefreshTokenToCookies(tokens, response);

        return new AccessTokenResponse(tokens.accessToken);
    }

    @ApiConfirm()
    @Public()
    @Post('confirm')
    public async confirm(
        @Res({ passthrough: true }) response: Response,
        @UserAgent() userAgent: string,
        @Body() confirmDto: ConfirmDto,
    ): Promise<AccessTokenResponse> {
        const tokens = await this.authenticationService.confirm(confirmDto, userAgent);

        if (!tokens) {
            throw new BadRequestException(INCORRECT_DATA);
        }

        this.setRefreshTokenToCookies(tokens, response);

        return new AccessTokenResponse(tokens.accessToken);
    }

    @ApiNewCode()
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('new-code')
    public async newCode(@Query() newCodeDto: NewCodeDto): Promise<CodeExpiredResponse> {
        const confirmTime = await this.authenticationService.newCode(newCodeDto.email);

        if (!confirmTime) {
            throw new InternalServerErrorException(INCORRECT_CODE_CONVERT);
        }

        return new CodeExpiredResponse(confirmTime);
    }

    @ApiBearerAuth()
    @Public()
    @Post('refresh-tokens')
    public async refreshTokens(
        @Cookie(REFRESH_TOKEN) refreshToken: string,
        @Res({ passthrough: true }) response: Response,
        @UserAgent() userAgent: string,
    ): Promise<AccessTokenResponse> {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const tokens = await this.authenticationService.refreshTokens(refreshToken, userAgent);

        if (!tokens) {
            throw new UnauthorizedException();
        }

        this.setRefreshTokenToCookies(tokens, response);

        return new AccessTokenResponse(tokens.accessToken);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
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

        try {
            const maxAge = convertTime('milliseconds', this.authenticationConfigService.refreshTokenExpire);

            response.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge,
                secure: this.applicationConfigService.isProduction,
                path: '/',
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
