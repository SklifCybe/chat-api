import { Global, Module } from '@nestjs/common';
import { AuthenticationConfigModule } from '../../config/authentication/config.module';
import { AuthenticationConfigService } from '../../config/authentication/config.service';
import { CacheInformationService } from './cache-information.service';

@Global()
@Module({
    imports: [AuthenticationConfigModule],
    providers: [CacheInformationService, AuthenticationConfigService],
    exports: [CacheInformationService],
})
// todo: rename to CacheManagerModule and rename CacheManagerService
export class CacheInformationModule {}
