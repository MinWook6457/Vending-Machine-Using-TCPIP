// worker.js

// Define the Worker class
class MyWorker {
  constructor() {
    // Set up message handler
    self.onmessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'stock':
          const stockResult = this.checkStock(payload);
          self.postMessage({ type: 'stock', payload: stockResult });
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };
  }

  // Method to check stock
  checkStock(item) {
    const stockAmount = parseInt(item);
    if (isNaN(stockAmount)) {
      console.error('Invalid stock amount:', item);
      return null;
    }
    return stockAmount;
  }
}

// Instantiate the Worker class
new MyWorker();
