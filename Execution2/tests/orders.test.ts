import { processOrder } from '../src/api/orders';

describe('Order Processing', () => {
    it('should return true for valid order > 100', () => {
        const result = processOrder({ id: '1', amount: 150 });
        expect(result).toBe(true);
    });

    it('should return true for valid order <= 100', () => {
        const result = processOrder({ id: '2', amount: 50 });
        expect(result).toBe(true);
    });

    it('should return false for invalid amount', () => {
        const result = processOrder({ id: '3', amount: 0 });
        expect(result).toBe(false);
    });

    it('should return false for invalid id', () => {
        const result = processOrder({ id: '', amount: 100 });
        expect(result).toBe(false);
    });
});
