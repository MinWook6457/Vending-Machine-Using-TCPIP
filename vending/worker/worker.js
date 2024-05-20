// Define the Worker class
class MyWorker {
  constructor() {
    // Set up message handle
    self.onmessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'stock':
          const stockResult = this.checkStock(payload);
          self.postMessage({ type: 'stock', payload: stockResult });
          break;
        case 'buy':
          const result = this.buyBeverage(payload);
          self.postMessage({ type: 'buy', payload: result });
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };
  }

  checkStock(item) {
    const stockAmount = parseInt(item);
    if (isNaN(stockAmount)) {
      console.error('Invalid stock amount:', item);
      return null;
    }
    return stockAmount;
  }

  buyBeverage() {
    const itemStock = 1 ; // 'this' 키워드를 사용하여 호출

    if (isNaN(itemStock)) {
      console.error('Invalid buy amount:', itemStock);
      return null;
    }
    return itemStock; // Perform the buy operation
  }
}

// Instantiate the Worker class
new MyWorker();
