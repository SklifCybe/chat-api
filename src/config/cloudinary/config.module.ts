import { Module } from '@nestjs/common';
import { CloudinaryConfigService } from './config.service';

@Module({
    providers: [CloudinaryConfigService],
    exports: [CloudinaryConfigService],
})
export class CloudinaryConfigModule {}
