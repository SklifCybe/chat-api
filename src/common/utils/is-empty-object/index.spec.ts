import { isEmptyObject } from '.';

describe.only('is-empty-object', () => {
    it('should return true because object is empty', () => {
        const obj = {};

        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return false because object is fullish', () => {
        const obj = { key: 'value' };

        expect(isEmptyObject(obj)).toBe(false);
    });

    it('should return true if take some empty object', () => {
        const firstObj = {};
        const secondObj = {};

        expect(isEmptyObject(firstObj, secondObj)).toBe(true);
    });

    it('should return false if some object have value', () => {
        const firstObj = {};
        const secondObj = { key: 'value'};

        expect(isEmptyObject(firstObj, secondObj)).toBe(false);
    });
})