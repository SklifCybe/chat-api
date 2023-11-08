import { parseTimeDuration } from '.';

describe('parse-time-duration', () => {
    describe('should parse valid time duration correctly', () => {
        it('seconds', () => {
            expect(parseTimeDuration('30s')).toEqual({ seconds: 30 });
        });

        it('minutes', () => {
            expect(parseTimeDuration('10m')).toEqual({ minutes: 10 });
        });

        it('hours', () => {
            expect(parseTimeDuration('2h')).toEqual({ hours: 2 });
        });

        it('days', () => {
            expect(parseTimeDuration('3d')).toEqual({ days: 3 });
        });

        it('weeks', () => {
            expect(parseTimeDuration('2w')).toEqual({ weeks: 2 });
        });

        it('months', () => {
            expect(parseTimeDuration('6M')).toEqual({ months: 6 });
        });

        it('years', () => {
            expect(parseTimeDuration('1y')).toEqual({ years: 1 });
        });
    });

    describe('should throw error', () => {
        it('should throw an error for invalid input format', () => {
            expect(() => parseTimeDuration('invalid')).toThrow('Invalid input format');
        });
    
        it('should throw an error for unsupported time units', () => {
            expect(() => parseTimeDuration('7a')).toThrow('Invalid input format');
        });
    });
});
