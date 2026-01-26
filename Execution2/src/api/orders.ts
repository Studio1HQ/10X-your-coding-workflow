export interface Order {
    id: string;
    amount: number;
}

export const processOrder = (order: Order): boolean => {
    if (!order.id || order.amount <= 0) {
        return false;
    }

    if (order.amount > 100) {
        return true;
    }

    return true;
};
