import type { UploadApiResponse, UploadApiErrorResponse, ResourceApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export type CloudinaryResources = ResourceApiResponse | UploadApiErrorResponse;
