import { Module } from '@nestjs/common';
import { ApplicationConfigService } from './config.service';

@Module({
    providers: [ApplicationConfigService],
    exports: [ApplicationConfigService],
})
export class ApplicationConfigModule {}
