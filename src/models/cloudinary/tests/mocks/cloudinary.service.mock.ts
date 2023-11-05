import { Readable } from 'stream';
import type { File } from '../../../../common/types/file.type';
import type { CloudinaryResponse } from '../../../../common/types/cloudinary-response.type';

export const cloudinaryResponse: CloudinaryResponse = {
    asset_id: 'c38d7237be0d429165a3bac26eadfae9',
    public_id: 'pdrly63aka6ar9liqsw4',
    version: 1699202883,
    version_id: 'b1961219b6753b0a111fd6ef3233e1c0',
    signature: '2be2128fe85796286c60a57aa4fae951c40b0fb1',
    width: 1014,
    height: 696,
    format: 'png',
    resource_type: 'image',
    created_at: '2023-11-05T16:48:03Z',
    tags: [],
    bytes: 172922,
    type: 'upload',
    etag: '8ffee2bb78b1ba5dcb6482e05dff84ee',
    placeholder: false,
    url: 'http://res.cloudinary.com/dyfochejl/image/upload/v1699202883/pdrly63aka6ar9liqsw4.png',
    secure_url: 'https://res.cloudinary.com/dyfochejl/image/upload/v1699202883/pdrly63aka6ar9liqsw4.png',
    folder: '',
    original_filename: 'file',
    api_key: '956359675869154',
    access_control: ['mock'],
    access_mode: 'mock',
    context: {},
    metadata: {},
    moderation: ['mock'],
    pages: 0,
};
export const file: File = {
    fieldname: 'file',
    originalname: 'file.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.alloc(5),
    size: 172922,
    destination: 'destination',
    filename: 'file.png',
    path: '/',
    stream: new Readable(),
};
