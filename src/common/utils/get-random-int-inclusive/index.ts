export const getRandomIntInclusive = (min: number, max: number): number => {
    if (min > max) {
        throw new Error('Min must be less than or equal to max.');
    }

    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);

    return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil);
};
