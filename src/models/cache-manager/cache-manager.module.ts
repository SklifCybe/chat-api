import { Global, Module } from '@nestjs/common';
import { AuthenticationConfigModule } from '../../config/authentication/config.module';
import { AuthenticationConfigService } from '../../config/authentication/config.service';
import { CacheManagerService } from './cache-manager.service';

@Global()
@Module({
    imports: [AuthenticationConfigModule],
    providers: [CacheManagerService, AuthenticationConfigService],
    exports: [CacheManagerService],
})
export class CacheManagerModule {}
