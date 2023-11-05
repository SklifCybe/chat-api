import { codeConfirmTime } from '.';
import type { ConfirmTime } from '../../types/time.type';

describe('code-confirm-time', () => {
    it('should return object contain seconds and milliseconds', () => {
        const receivedConfirmTime: ConfirmTime = {
            seconds: 60,
            milliseconds: 60_000,
        };

        expect(codeConfirmTime('1m')).toEqual(receivedConfirmTime);
    });

    it('should return null if convertTime throw exception', () => {
        expect(codeConfirmTime('error')).toBeNull();
    });
});
