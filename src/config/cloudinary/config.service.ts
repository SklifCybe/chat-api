import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/types/environment.type';

@Injectable()
export class CloudinaryConfigService {
    constructor(private readonly configService: ConfigService<Environment>) {}

    public readonly name = this.configService.get<string>('CLOUDINARY_NAME');
    public readonly apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    public readonly apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
}
