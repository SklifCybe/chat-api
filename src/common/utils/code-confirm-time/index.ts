import type { Time } from '../../interfaces/time.interface';
import { convertTime } from '../convert-time';

export const codeConfirmTime = (time: string): Time['confirmTime'] | null => {
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
