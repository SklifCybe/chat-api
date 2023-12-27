import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import type { File } from '../../common/types/file.type';
import type { CloudinaryResources, CloudinaryResponse } from '../../common/types/cloudinary-response.type';
import { getRandomIntInclusive } from '../../common/utils/get-random-int-inclusive';
import { CloudinaryConfigService } from '../../config/cloudinary/config.service';

// todo: use aws
// todo: rewrite to fetch requests and remove library cloudinary
@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger();

    constructor(private readonly cloudinaryConfigService: CloudinaryConfigService) {}

    public async uploadImage(image: File): Promise<CloudinaryResponse | null> {
        try {
            const uploadedImage = await this.uploadImagePrivate(image);

            return uploadedImage;
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    public async getDefaultAvatarUrl(): Promise<string | null> {
        try {
            const result = await this.getDefaultAvatars();

            const defaultIndex = getRandomIntInclusive(0, result.resources.length - 1);

            return result.resources[defaultIndex].secure_url;
        } catch(error) {
            this.logger.error(error);

            return null;
        }
    }

    private async getDefaultAvatars(): Promise<CloudinaryResources> {
        const maxResults = this.cloudinaryConfigService.maxDefaultImages;

        return new Promise((resolve, reject) => {
            cloudinary.api.resources(
                { max_results: maxResults, type: 'private' },
                (error, res) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(res);
                },
            );
        });
    }

    private async uploadImagePrivate(image: File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
                if (error || !result) {
                    return reject();
                }
                return resolve(result);
            });

            const readableStream = new Readable();

            readableStream.push(image.buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);

            return uploadStream;
        });
    }
}
