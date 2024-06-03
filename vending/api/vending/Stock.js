import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Stock({ beverage, stock, onStockButtonClick }) {
  const [worker, setWorker] = useState(null);
  const [remainingStock, setRemainingStock] = useState(null);

  useEffect(() => {
    const workerInstance = new MyWorker();
    console.log(`Created worker ${workerInstance} instance:`, workerInstance);

    setWorker(workerInstance);

    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, []);

  const handleStockButtonClick = async () => {
    if (worker) {
      onStockButtonClick(beverage);
      worker.postMessage({ type: 'stock', payload: { beverage, stock } });
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data;
  
      switch (type) {
        case 'stock':
          if (payload.error) {
            console.error(payload.error);
          } else {
            setRemainingStock(payload.stock); // 재고 정보 업데이트
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
      <button onClick={handleStockButtonClick}>Check Stock</button>
      {remainingStock !== null && <p>Remaining stock: {remainingStock}</p>}
    </div>
  );
}

export default Stock;
