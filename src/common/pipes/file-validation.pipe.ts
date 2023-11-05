import type { PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { IMAGE_MAX_SIZE_ONE_MB } from '../constants/image.constant';
import { FILE_MAX_SIZE_1_MB } from '../constants/error-messages.constant';
import type { File } from '../types/file.type';

export class FileValidationPipe implements PipeTransform {
    public transform(file: File): File | undefined {
        if (!file) {
            return;
        }

        if (file.size > IMAGE_MAX_SIZE_ONE_MB) {
            throw new BadRequestException(FILE_MAX_SIZE_1_MB);
        }

        return file;
    }
}
