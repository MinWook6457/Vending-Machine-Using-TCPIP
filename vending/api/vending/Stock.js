// Stock.js
import React, { useState, useEffect } from 'react';
import MyWorker from '../../worker/worker.js'; 

function Stock() {
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

  const handleStockButtonClick = () => {
    if (worker) {
      worker.postMessage({ type: 'stock', payload: 'water' }); 
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'stock':
        
          setStock(payload);
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
      {stock !== null && <p>Stock: {stock}</p>}
    </div>
  );
}

export default Stock;
