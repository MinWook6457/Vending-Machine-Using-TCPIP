// worker.js

// Define the Worker class
class MyWorker {
  constructor() {
    // Set up message handler
    this.onmessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'stock':
          const stockResult = this.checkStock(payload);
          postMessage({ type: 'stock', payload: stockResult });
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };
  }

  // Method to check stock
  checkStock(item) {
    const stockAmount = parseInt(item, 10);
    if (isNaN(stockAmount)) {
      console.error('Invalid stock amount:', item);
      return null;
    }
    return stockAmount - 1;
  }
}

// Instantiate the Worker class
const workerInstance = new MyWorker();

// Export the worker instance
module.exports = workerInstance;
