import { getRandomIntInclusive } from '../get-random-int-inclusive';

export const createConfirmCode = (): string => {
    return new Array(4)
        .fill(null)
        .map(() => getRandomIntInclusive(0, 9))
        .join('');
};
