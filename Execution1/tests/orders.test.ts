// Tests for Orders API with rate limiting
import { OrdersAPI, Order } from '../src/api/orders';
import { rateLimiter, RateLimiter } from '../src/lib/rateLimit';

describe('OrdersAPI Rate Limiting', () => {
    let ordersAPI: OrdersAPI;
    const testIP = '192.168.1.1';

    beforeEach(() => {
        ordersAPI = new OrdersAPI();
        // Reset the global rate limiter before each test
        rateLimiter.reset();
        // Mock the createOrder method to avoid "Not implemented" errors
        ordersAPI.createOrder = jest.fn().mockResolvedValue({
            id: 'test-order-123',
            customerId: 'customer-456',
            items: [{ productId: 'product-1', quantity: 2, price: 29.99 }],
            total: 59.98,
            status: 'pending',
            createdAt: new Date(),
        } as Order);
    });

    afterEach(() => {
        rateLimiter.reset();
    });

    afterAll(() => {
        // Stop the global rate limiter cleanup to prevent Jest from hanging
        rateLimiter.stopCleanup();
    });

    describe('Normal request flow', () => {
        test('should successfully create order within rate limit', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 2, price: 29.99 }],
                total: 59.98,
                status: 'pending' as const,
            };

            const response = await ordersAPI.createOrderWithRateLimit(orderData, testIP);

            expect(response.success).toBe(true);
            expect(response.statusCode).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data?.id).toBe('test-order-123');
        });

        test('should include X-RateLimit-Remaining header in successful response', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 2, price: 29.99 }],
                total: 59.98,
                status: 'pending' as const,
            };

            const response = await ordersAPI.createOrderWithRateLimit(orderData, testIP);

            expect(response.headers['X-RateLimit-Remaining']).toBeDefined();
            expect(response.headers['X-RateLimit-Remaining']).toBe(4); // 5 - 1 = 4 remaining
        });

        test('should decrement remaining count with each request', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 1, price: 10.0 }],
                total: 10.0,
                status: 'pending' as const,
            };

            const response1 = await ordersAPI.createOrderWithRateLimit(orderData, testIP);
            expect(response1.headers['X-RateLimit-Remaining']).toBe(4);

            const response2 = await ordersAPI.createOrderWithRateLimit(orderData, testIP);
            expect(response2.headers['X-RateLimit-Remaining']).toBe(3);

            const response3 = await ordersAPI.createOrderWithRateLimit(orderData, testIP);
            expect(response3.headers['X-RateLimit-Remaining']).toBe(2);
        });
    });

    describe('Rate limit exceeded', () => {
        test('should return HTTP 429 when rate limit is exceeded', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 1, price: 10.0 }],
                total: 10.0,
                status: 'pending' as const,
            };

            // Make 5 successful requests
            for (let i = 0; i < 5; i++) {
                const response = await ordersAPI.createOrderWithRateLimit(orderData, testIP);
                expect(response.success).toBe(true);
                expect(response.statusCode).toBe(200);
            }

            // 6th request should be rate limited
            const response = await ordersAPI.createOrderWithRateLimit(orderData, testIP);
            expect(response.success).toBe(false);
            expect(response.statusCode).toBe(429);
        });

        test('should return proper error message when rate limited', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 1, price: 10.0 }],
                total: 10.0,
                status: 'pending' as const,
            };

            // Exhaust rate limit
            for (let i = 0; i < 5; i++) {
                await ordersAPI.createOrderWithRateLimit(orderData, testIP);
            }

            const response = await ordersAPI.createOrderWithRateLimit(orderData, testIP);

            expect(response.error).toBeDefined();
            expect(response.error?.error).toBe('Rate limit exceeded');
            expect(response.error?.message).toBe('Too many requests. Please try again later.');
            expect(response.error?.retryAfter).toBe(60);
        });

        test('should include X-RateLimit-Remaining header showing 0 when rate limited', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 1, price: 10.0 }],
                total: 10.0,
                status: 'pending' as const,
            };

            // Exhaust rate limit
            for (let i = 0; i < 5; i++) {
                await ordersAPI.createOrderWithRateLimit(orderData, testIP);
            }

            const response = await ordersAPI.createOrderWithRateLimit(orderData, testIP);

            expect(response.headers['X-RateLimit-Remaining']).toBe(0);
        });
    });

    describe('Rate limit reset', () => {
        test('should allow requests again after rate limit window expires', async () => {
            // Use a shorter window for testing (1 second)
            const shortWindowLimiter = new RateLimiter(5, 1000);
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 1, price: 10.0 }],
                total: 10.0,
                status: 'pending' as const,
            };

            // Exhaust rate limit
            for (let i = 0; i < 5; i++) {
                const result = shortWindowLimiter.checkRateLimit(testIP);
                expect(result.allowed).toBe(true);
            }

            // Verify rate limit is exceeded
            const rateLimitedResult = shortWindowLimiter.checkRateLimit(testIP);
            expect(rateLimitedResult.allowed).toBe(false);

            // Wait for window to expire
            await new Promise((resolve) => setTimeout(resolve, 1100));

            // Should be allowed again
            const afterResetResult = shortWindowLimiter.checkRateLimit(testIP);
            expect(afterResetResult.allowed).toBe(true);
            expect(afterResetResult.remaining).toBe(4);

            shortWindowLimiter.stopCleanup();
        }, 10000); // Increase timeout for this test
    });

    describe('Multiple IPs', () => {
        test('should track rate limits independently per IP', async () => {
            const orderData = {
                customerId: 'customer-456',
                items: [{ productId: 'product-1', quantity: 1, price: 10.0 }],
                total: 10.0,
                status: 'pending' as const,
            };

            const ip1 = '192.168.1.1';
            const ip2 = '192.168.1.2';

            // Make 5 requests from IP1
            for (let i = 0; i < 5; i++) {
                const response = await ordersAPI.createOrderWithRateLimit(orderData, ip1);
                expect(response.success).toBe(true);
            }

            // IP1 should be rate limited
            const ip1Response = await ordersAPI.createOrderWithRateLimit(orderData, ip1);
            expect(ip1Response.statusCode).toBe(429);

            // IP2 should still be allowed
            const ip2Response = await ordersAPI.createOrderWithRateLimit(orderData, ip2);
            expect(ip2Response.success).toBe(true);
            expect(ip2Response.statusCode).toBe(200);
            expect(ip2Response.headers['X-RateLimit-Remaining']).toBe(4);
        });
    });
});
