import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfigModule } from '../../config/cloudinary/config.module';
import { CloudinaryConfigService } from '../../config/cloudinary/config.service';

const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    import: [CloudinaryConfigModule],
    inject: [CloudinaryConfigService],
    useFactory: (cloudinaryConfigService: CloudinaryConfigService) => {
        return cloudinary.config({
            cloud_name: cloudinaryConfigService.name,
            api_key: cloudinaryConfigService.apiKey,
            api_secret: cloudinaryConfigService.apiSecret,
        });
    },
};

@Module({
    providers: [CloudinaryProvider, CloudinaryConfigService],
})
export class CloudinaryProviderModule {}
