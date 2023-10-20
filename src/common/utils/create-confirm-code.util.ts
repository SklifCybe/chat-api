const getRandomIntInclusive = (min: number, max: number): number => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);

    return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil);
};

export const createConfirmCode = (): string => {
    return new Array(4)
        .fill(null)
        .map(() => getRandomIntInclusive(0, 9))
        .join('');
};
