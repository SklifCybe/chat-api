import { Module } from '@nestjs/common';
import { CloudinaryProviderModule } from '../../providers/cloudinary/provider.module';
import { CloudinaryService } from './cloudinary.service';

@Module({
    imports: [CloudinaryProviderModule],
    providers: [CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}