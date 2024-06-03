// Buy.js

import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Buy({ beverage, nowStock }) {
  const [worker, setWorker] = useState(null);
  const [buyStock, setBuyStock] = useState([]);

  console.log(beverage)
  console.log(nowStock)

  
  useEffect(() => {
    buyDrink();
    const workerInstance = new MyWorker();
    console.log(`Created worker ${workerInstance} instance:`, workerInstance);

    console.log(buyStock)

    setWorker(workerInstance);

  

    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, []);

  const buyDrink = async () => {
    try {
      const response = await window.buy.getBuy(beverage, nowStock);
      console.log(response);
      setBuyStock(response);
    } catch (error) {
      console.error('Failed to fetch drink data:', error);
    }
  };

  return (
    <div>
      <button onClick={buyDrink}>구매</button>
    </div>
  );
}

export default Buy;
