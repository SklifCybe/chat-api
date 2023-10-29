import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
    HttpCode,
    Query,
    InternalServerErrorException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthenticationService } from './authentication.service';
import type { Tokens } from '../common/interfaces/tokens.interface';
import { REFRESH_TOKEN } from '../common/constants/token.constant';
import { ApplicationConfigService } from '../config/application/config.service';
import { Cookie } from '../common/decorators/cookie.decorator';
import { UserAgent } from '../common/decorators/user-agent.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CodeExpiredResponse } from '../common/responses/code-expired.response';
import { ConfirmDto } from './dto/confirm.dto';
import { NewCodeDto } from './dto/new-code.dto';
import { INCORRECT_DATA, INCORRECT_CODE_CONVERT } from '../common/constants/error-messages.constant';
import { ApiResponseSignUp } from '../swagger/decorators/api-response-sign-up.decorator';
import { ApiResponseSignIn } from '../swagger/decorators/api-response-sign-in.decorator';
import { ApiResponseConfirm } from '../swagger/decorators/api-response-confirm.decorator';
import { ApiResponseNewCode } from '../swagger/decorators/api-response-new-code.decorator';
import { AccessTokenResponse } from '../common/responses/access-token.response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly applicationConfigService: ApplicationConfigService,
    ) {}

    @ApiResponseSignUp()
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

    @ApiResponseSignIn()
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

    @ApiResponseConfirm()
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

    @ApiResponseNewCode()
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
    // todo: it not get method. change to other method
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

        if (!tokens) {
            throw new UnauthorizedException();
        }

        this.setRefreshTokenToCookies(tokens, response);

        return tokens;
    }

    @ApiBearerAuth()
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
