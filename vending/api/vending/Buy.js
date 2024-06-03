// Buy.js

import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Buy({ beverage, nowStock, updateStock }) {
  const [worker, setWorker] = useState(null);
  const [buyStock, setBuyStock] = useState(null);

  useEffect(() => {
    const workerInstance = new MyWorker();
    console.log(`Created worker instance:`, workerInstance);

    setWorker(workerInstance);

    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, []);

  const handleBuyButtonClick = () => {
    if (worker) {
      worker.postMessage({ type: 'buy', payload: { beverage } });
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'buy':
          if (payload.error) {
            console.error(payload.error);
          } else {
            setBuyStock(nowStock)
          }
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };

    if (worker) {
      worker.onmessage = handleMessage;
    }

    return () => {
      if (worker) {
        worker.onmessage = null;
      }
    };
  }, [worker, buyStock]); 

  return (
    <div>
      <button onClick={handleBuyButtonClick}>구매</button>
    </div>
  );
}

export default Buy;
