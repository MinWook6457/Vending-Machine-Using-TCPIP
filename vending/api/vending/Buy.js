import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Buy({ beverage }) { // beverage를 props로 받아옴
  const [stock, setStock] = useState(null);
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

  const handleBuyButtonClick = () => {
    if (worker) {
      worker.postMessage({ type: 'buy', payload: beverage });
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data;
      console.log(type);
      console.log(payload);
      switch (type) {
        case 'buy':
          if (payload.error) {
            console.error(payload.error);
          } else {
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
  }, [beverage, worker]); // beverage를 의존성 배열에 추가

  return (
    <div>
      <button onClick={handleBuyButtonClick}>구매</button>
      {stock !== null && (
        <p>{beverage}: {stock} left</p>
      )}
    </div>
  );
}

export default Buy;
