import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Buy() {
  const [beverage, setBeverage] = useState(null);
  const [stock, setStock] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const workerInstance = new MyWorker();
    console.log('Created worker instance:', workerInstance);

    setWorker(workerInstance);

    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, []);

  const handleBuyButtonClick = (item) => {
    if (worker) {
      worker.postMessage({ type: 'buy', payload: item });
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
            setBeverage(payload.beverage);
            setStock(payload.stock);
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
  }, [worker]);

  return (
    <div>
      <button onClick={() => handleBuyButtonClick('cola',10)}>구매</button>
      {beverage !== null && stock !== null && (
        <p>{beverage}: {stock} left</p>
      )}
    </div>
  );
}

export default Buy;
