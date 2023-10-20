import { createConfirmCode } from '.';

describe('create-confirm-code', () => {
    const result = createConfirmCode();

    it('code should have correct length', () => {
        expect(result).toHaveLength(4);
    });

    it('code should be string', () => {
        expect(typeof result).toBe('string');
    });

    it('should contain only numbers', () => {
        expect(Number(result)).not.toBeNaN();
    });
});
