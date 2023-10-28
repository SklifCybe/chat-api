import { Global, Module } from '@nestjs/common';
import { AuthenticationConfigModule } from '../../config/authentication/config.module';
import { CacheManagerService } from './cache-manager.service';

@Global()
@Module({
    imports: [AuthenticationConfigModule],
    providers: [CacheManagerService],
    exports: [CacheManagerService],
})
export class CacheManagerModule {}
