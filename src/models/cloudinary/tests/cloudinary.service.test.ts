import { Test } from '@nestjs/testing';
import { CloudinaryService } from '../cloudinary.service';
import { CloudinaryProviderModule } from '../../../providers/cloudinary/provider.module';
import { cloudinaryResponse, file, mockCloudinaryResources } from './mocks/cloudinary.service.mock';

jest.mock('cloudinary', () => ({
    v4: {
        uploader: {
            upload_stream: jest.fn(() => cloudinaryResponse),
        },
        api: {
            resources: jest.fn(() => mockCloudinaryResources),
        },
    },
}));

describe('CloudinaryService', () => {
    let cloudinaryService: CloudinaryService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CloudinaryProviderModule],
            providers: [CloudinaryService],
        }).compile();

        cloudinaryService = moduleRef.get<CloudinaryService>(CloudinaryService);
    });

    describe('uploadImage', () => {
        it('should upload an image without problem', async () => {
            const result = await cloudinaryService.uploadImage(file);

            expect(result).toEqual(cloudinaryResponse);
        });

        it('should handle exception and return null', async () => {
            const uploadImagePrivate = jest.spyOn(cloudinaryService as any, 'uploadImagePrivate');
            uploadImagePrivate.mockImplementation(() => {
                throw new Error();
            });

            const result = await cloudinaryService.uploadImage(file);

            expect(result).toBeNull();
        });
    });

    describe('getDefaultAvatarUrl', () => {
        it('should return avatar url without problem', async () => {
            const result = await cloudinaryService.getDefaultAvatarUrl();

            expect(result).toEqual(mockCloudinaryResources);
        });

        it('should handle exception and return null', async () => {
            const uploadImagePrivate = jest.spyOn(cloudinaryService as any, 'getDefaultAvatars');
            uploadImagePrivate.mockImplementation(() => {
                throw new Error();
            });

            const result = await cloudinaryService.getDefaultAvatarUrl();

            expect(result).toBeNull();
        });
    });
});
