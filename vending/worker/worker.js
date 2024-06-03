let stock = {};

class MyWorker {
  constructor() {
    self.onmessage = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'init':
          stock = payload.stock;
          self.postMessage({ type: 'init', payload: stock });
          break;
        case 'stock':
          const beverage = payload.beverage;
          const beverageStock = stock[beverage] ? stock[beverage].stock : null;
          self.postMessage({ type: 'stock', payload: { beverage, stock: beverageStock } });
          break;
        case 'buy':
          const buyResult = this.buyBeverage(payload.beverage);
          self.postMessage({ type: 'buy', payload: buyResult });
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };
  }

  buyBeverage(beverage) {
    if (!stock.hasOwnProperty(beverage)) {
      return { success: false, message: 'Unknown beverage' };
    }
    if (stock[beverage].stock > 0) {
      stock[beverage].stock -= 1;
      return { success: true, beverage, remainingStock: stock[beverage].stock };
    } else {
      return { success: false, message: 'Out of stock' };
    }
  }
}

// Instantiate the Worker class
new MyWorker();
