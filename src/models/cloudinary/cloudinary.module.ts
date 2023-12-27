import { Module } from '@nestjs/common';
import { CloudinaryProviderModule } from '../../providers/cloudinary/provider.module';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfigModule } from '../../config/cloudinary/config.module';

@Module({
    imports: [CloudinaryProviderModule, CloudinaryConfigModule],
    providers: [CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}