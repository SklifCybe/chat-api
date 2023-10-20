import { convertToSeconds } from '.';

describe('convert-to-seconds', () => {
    it('should work with regular number', () => {
        expect(convertToSeconds('1234')).toBe(1234);
    });

    it('should work with regular number', () => {
        expect(convertToSeconds('1234')).toBe(1234);
    });
    
    describe('should correct convert', () => {
        it('seconds to seconds', () => {
            expect(convertToSeconds('100s')).toBe(100);
        });
    
        it('minutes to seconds', () => {
            expect(convertToSeconds('20m')).toBe(20 * 60);
        });
    
        it('hours to seconds', () => {
            expect(convertToSeconds('20h')).toBe(20 * 60 * 60);
        });

        it('days to seconds', () => {
            expect(convertToSeconds('20d')).toBe(20 * 60 * 60 * 24);
        });

        it('weeks to seconds', () => {
            expect(convertToSeconds('20w')).toBe(20 * 60 * 60 * 24 * 7);
        });

        it('months to seconds', () => {
            expect(convertToSeconds('20M')).toBe(20 * 60 * 60 * 30 * 24);
        });

        it('years to seconds', () => {
            expect(convertToSeconds('20y')).toBe(20 * 60 * 60 * 365 * 24);
        });
    });

    describe('error', () => {
        const time = 'incorrect time';

        it('should throw exception, because incorrect time', () => {
            expect(() => convertToSeconds(time)).toThrow(Error);
        });
    
        it('should have correct error message', () => {
            expect(() => convertToSeconds(time)).toThrow('Invalid time string');
        });
    });
});
