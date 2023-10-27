import type { ValidationError } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { exceptionFactory } from '.';

const errors: ValidationError[] = [
    { property: 'first', constraints: { field1: 'Error 1' } },
    { property: 'second', constraints: { field2: 'Error 2' } },
    { property: 'third', constraints: { field3: 'Error 3' } },
];

describe('exception-factory', () => {
    it('should be instanceof from BadRequestException if call with empty array', () => {
        const result = exceptionFactory([]);

        expect(result).toBeInstanceOf(BadRequestException);
    });

    it('should be instanceof from BadRequestException if call with validation errors', () => {
        const result = exceptionFactory(errors);

        expect(result).toBeInstanceOf(BadRequestException);
    });

    it('should have default message if firstErrorMessage will be undefined', () => {
        const result = exceptionFactory([]);

        expect(result.message).toBe('Bad Request');
    });

    it('should create a BadRequestException with the first error message', () => {
        const result = exceptionFactory(errors);
        const firstMessage = errors[0].constraints?.field1;

        expect(result.message).toBe(firstMessage);
    });

    it('should handle undefined constraints', () => {
        const validationErrors: ValidationError[] = [{ property: 'first', constraints: undefined }];
    
        const result = exceptionFactory(validationErrors);
    
        expect(result.message).toBe('Bad Request');
      });
});
