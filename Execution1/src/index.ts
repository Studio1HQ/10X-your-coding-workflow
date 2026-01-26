// Main entry point
import { OrdersAPI } from './api/orders';

async function main() {
  console.log('Application started');

  const ordersAPI = new OrdersAPI();

  // TODO: Add your application logic here
}

main().catch(console.error);
