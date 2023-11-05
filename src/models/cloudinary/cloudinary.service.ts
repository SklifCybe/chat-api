import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import type { File } from '../../common/types/file.type';
import type { CloudinaryResponse } from '../../common/types/cloudinary-response.type';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger();

    public async uploadImage(image: File): Promise<CloudinaryResponse | null> {
        try {
            const uploadedImage = await this.uploadImagePrivate(image);

            return uploadedImage;
        } catch (error) {
            this.logger.error(error);

            return null;
        }
    }

    private async uploadImagePrivate(image: File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
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
