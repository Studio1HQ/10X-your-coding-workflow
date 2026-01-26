# How to Run the Rate Limiting Implementation

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## Test Results

✅ **All 8 tests passing**

```
PASS  tests/orders.test.ts
  OrdersAPI Rate Limiting
    Normal request flow
      ✓ should successfully create order within rate limit
      ✓ should include X-RateLimit-Remaining header in successful response
      ✓ should decrement remaining count with each request
    Rate limit exceeded
      ✓ should return HTTP 429 when rate limit is exceeded
      ✓ should return proper error message when rate limited
      ✓ should include X-RateLimit-Remaining header showing 0 when rate limited
    Rate limit reset
      ✓ should allow requests again after rate limit window expires
    Multiple IPs
      ✓ should track rate limits independently per IP

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

## Project Structure

```
/Users/mac/ANTIGRAVITY_V1/
├── src/
│   ├── api/
│   │   └── orders.ts          # OrdersAPI with rate limiting
│   ├── lib/
│   │   └── rateLimit.ts       # Rate limiting utility
│   └── index.ts               # Main entry point
├── tests/
│   └── orders.test.ts         # Comprehensive test suite
├── package.json               # Dependencies and scripts
├── jest.config.js             # Jest configuration
└── tsconfig.json              # TypeScript configuration
```

## Usage Example

```typescript
import { OrdersAPI } from './src/api/orders';

const ordersAPI = new OrdersAPI();

// Create an order with rate limiting
const response = await ordersAPI.createOrderWithRateLimit(
  {
    customerId: 'customer-123',
    items: [{ productId: 'prod-1', quantity: 2, price: 29.99 }],
    total: 59.98,
    status: 'pending',
  },
  '192.168.1.1' // IP address
);

if (response.success) {
  console.log('Order created:', response.data);
  console.log('Remaining requests:', response.headers['X-RateLimit-Remaining']);
} else {
  console.log('Rate limited:', response.error);
  console.log('Retry after:', response.error?.retryAfter, 'seconds');
}
```

## Rate Limiting Behavior

- **Limit**: 5 requests per minute per IP address
- **Window**: 60 seconds (sliding window)
- **Response on success**: HTTP 200 with X-RateLimit-Remaining header
- **Response on limit exceeded**: HTTP 429 with error details and X-RateLimit-Remaining: 0
- **Storage**: In-memory (suitable for single-instance deployments)

## Next Steps

For production use, consider:
1. Using Redis or another distributed cache for multi-instance deployments
2. Adding rate limit headers to all API responses (not just orders)
3. Implementing different rate limits for authenticated vs. anonymous users
4. Adding rate limit monitoring and alerting
