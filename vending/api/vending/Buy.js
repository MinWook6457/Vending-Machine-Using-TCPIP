import React, { useState } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Buy({ beverage, nowStock }) {
  const [buyStock, setBuyStock] = useState([]);

  const buyDrink = async () => {
    try {
      console.log(beverage,nowStock)
      const test = {beverage, stock: nowStock}
      const response = await window.buy.getBuy(test);
      console.log(response);
      setBuyStock(response.stock);
      console.log(buyStock)
    } catch (error) {
      console.error('Failed to fetch drink data:', error);
    }
  };

  return (
    <div>
      <button onClick={buyDrink}>구매</button>
      <div>남은 재고: {buyStock}</div>
    </div>
  );
}

export default Buy;
