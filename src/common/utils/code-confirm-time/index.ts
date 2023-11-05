import type { ConfirmTime } from '../../types/time.type';
import { convertTime } from '../convert-time';

export const codeConfirmTime = (time: string): ConfirmTime | null => {
    try {
        return {
            seconds: convertTime('seconds', time),
            milliseconds: convertTime('milliseconds', time),
        };
    } catch (error) {
        console.error(error);

        return null;
    }
};
