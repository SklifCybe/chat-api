import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensRepository } from './tokens.repository';
import { AuthenticationConfigService } from '../../config/authentication/config.service';

@Module({
    providers: [TokensService, TokensRepository, AuthenticationConfigService],
    exports: [TokensService],
})
export class TokensModule {}
