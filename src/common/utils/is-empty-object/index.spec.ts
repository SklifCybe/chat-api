import { isEmptyObject } from '.';

describe.only('is-empty-object', () => {
    it('should return true because object is empty', () => {
        const obj = {};

        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return false because object is fullish', () => {
        const obj = { name: 'name' };

        expect(isEmptyObject(obj)).toBe(false);
    });
})