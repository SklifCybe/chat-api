import { getRandomIntInclusive } from '.';

describe('getRandomIntInclusive', () => {
    it('should return a random integer between min and max (inclusive)', () => {
        const min = 1;
        const max = 10;

        const result = getRandomIntInclusive(min, max);

        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
    });

    it('should return the minimum value when min and max are the same', () => {
        const min = 5;
        const max = 5;

        const result = getRandomIntInclusive(min, max);

        expect(result).toBe(min);
    });

    it('should return a valid result for negative min and max values', () => {
        const min = -10;
        const max = -5;

        const result = getRandomIntInclusive(min, max);

        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
    });

    it('should handle non-integer input values by rounding them', () => {
        const min = 1.5;
        const max = 9.9;

        const result = getRandomIntInclusive(min, max);

        expect(result).toBeGreaterThanOrEqual(Math.round(min));
        expect(result).toBeLessThanOrEqual(Math.round(max));
        expect(Number.isInteger(result)).toBe(true);
    });

    it('should throw an error if min is greater than max', () => {
        const min = 10;
        const max = 5;

        expect(() => getRandomIntInclusive(min, max)).toThrowError('Min must be less than or equal to max.');
    });
});
