type Mode = 'seconds' | 'milliseconds';

export const convertTime = (mode: Mode, time: string): number => {
    const numberTime = Number(time);
    const character = time.at(time.length - 1);

    if (!isNaN(numberTime)) {
        return parseInt(time);
    }

    let seconds: number;

    switch (character) {
        case 's':
            seconds = 1;
            break;
        case 'm':
            seconds = 60;
            break;
        case 'h':
            seconds = 60 * 60;
            break;
        case 'd':
            seconds = 24 * 60 * 60;
            break;
        case 'w':
            seconds = 24 * 60 * 60 * 7;
            break;
        case 'M':
            seconds = 30 * 24 * 60 * 60;
            break;
        case 'y':
            seconds = 365 * 24 * 60 * 60;
            break;
        default:
            throw new Error('Invalid time string');
    }

    const num = parseInt(time.slice(0, -1));
    const result = num * seconds;

    return mode === 'seconds' ? result : result * 1000;
};
