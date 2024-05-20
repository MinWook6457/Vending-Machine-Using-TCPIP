import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Stock({ stock }) { // beverage를 props로 받아옴
    const [worker, setWorker] = useState(null);

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

  const handleStockButtonClick = () => {
    if (worker) {
      worker.postMessage({ type: 'stock', payload: stock });
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data;
      console.log(type);
      console.log(payload);
      switch (type) {
        case 'stock':
          if (payload.error) {
            console.error(payload.error);
          } else {
            //setStock(payload);
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
  }, [stock, worker]); 

  return (
    <div>
      <button onClick={handleStockButtonClick}>재고</button>
    </div>
  );
}

export default Stock;
