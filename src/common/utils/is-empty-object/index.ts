export const isEmptyObject = (...objects: Array<any>): boolean => {
    const totalObject = Object.assign({}, ...objects);

    return Object.keys(totalObject).length === 0;
}