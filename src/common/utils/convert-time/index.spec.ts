import { convertTime } from '.';

describe('convert-time', () => {
    it('should work with regular number', () => {
        expect(convertTime('seconds', '1234')).toBe(1234);
    });

    describe('error', () => {
        const time = 'incorrect time';

        it('should throw exception, because incorrect time', () => {
            expect(() => convertTime('seconds', time)).toThrow(Error);
        });

        it('should have correct error message', () => {
            expect(() => convertTime('seconds', time)).toThrow('Invalid time string');
        });
    });

    describe('should correct convert to seconds', () => {
        it('seconds to seconds', () => {
            expect(convertTime('seconds', '100s')).toBe(100);
        });

        it('minutes to seconds', () => {
            expect(convertTime('seconds', '20m')).toBe(20 * 60);
        });

        it('hours to seconds', () => {
            expect(convertTime('seconds', '20h')).toBe(20 * 60 * 60);
        });

        it('days to seconds', () => {
            expect(convertTime('seconds', '20d')).toBe(20 * 60 * 60 * 24);
        });

        it('weeks to seconds', () => {
            expect(convertTime('seconds', '20w')).toBe(20 * 60 * 60 * 24 * 7);
        });

        it('months to seconds', () => {
            expect(convertTime('seconds', '20M')).toBe(20 * 60 * 60 * 30 * 24);
        });

        it('years to seconds', () => {
            expect(convertTime('seconds', '20y')).toBe(20 * 60 * 60 * 365 * 24);
        });
    });

    describe('should correct convert to milliseconds', () => {
        it('seconds to milliseconds', () => {
            expect(convertTime('milliseconds', '100s')).toBe(100 * 1000);
        });

        it('minutes to milliseconds', () => {
            expect(convertTime('milliseconds', '20m')).toBe(20 * 60 * 1000);
        });

        it('hours to milliseconds', () => {
            expect(convertTime('milliseconds', '20h')).toBe(20 * 60 * 60 * 1000);
        });

        it('days to milliseconds', () => {
            expect(convertTime('milliseconds', '20d')).toBe(20 * 60 * 60 * 24 * 1000);
        });

        it('weeks to milliseconds', () => {
            expect(convertTime('milliseconds', '20w')).toBe(20 * 60 * 60 * 24 * 7 * 1000);
        });

        it('months to milliseconds', () => {
            expect(convertTime('milliseconds', '20M')).toBe(20 * 60 * 60 * 30 * 24 * 1000);
        });

        it('years to milliseconds', () => {
            expect(convertTime('milliseconds', '20y')).toBe(20 * 60 * 60 * 365 * 24 * 1000);
        });
    });
});
