import type { Duration } from 'date-fns';

export const parseTimeDuration = (input: string): Duration => {
    const errorMessage = 'Invalid input format';
    const durationRegex = /^(\d+)([smhdwMy])$/;

    const matches = input.match(durationRegex);

    if (!matches) {
        throw new Error(errorMessage);
    }

    const value = parseInt(matches[1]);
    const unit = matches[2];

    switch (unit) {
        case 's':
            return { seconds: value };
        case 'm':
            return { minutes: value };
        case 'h':
            return { hours: value };
        case 'd':
            return { days: value };
        case 'w':
            return { weeks: value };
        case 'M':
            return { months: value };
        case 'y':
            return { years: value };
        default:
            throw new Error(errorMessage);
    }
};
