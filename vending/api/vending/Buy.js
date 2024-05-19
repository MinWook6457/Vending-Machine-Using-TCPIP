import React, { useState, useEffect } from 'react';
import MyWorker from 'worker-loader!../../worker/worker.js'; // Adjust the path as necessary

function Buy() {
  const [beverage, setBeverage] = useState(null);
  const [stock, setStock] = useState(null);
  const [customerTotal, setCustomerTotal] = useState(100); // 고객의 초기 총액 설정

  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const workerInstance = new MyWorker();
    console.log('Created worker instance:', workerInstance);

    setWorker(workerInstance);

    // 워커 메시지 핸들러 설정
    workerInstance.onmessage = handleMessage;

    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, []);

  // 워커로부터 수신된 데이터 처리
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

  const handleBuyButtonClick = (item, price) => {
    if (worker) {
      if(customerTotal >= price) {
        setCustomerTotal(customerTotal - price);
        worker.postMessage({ type: 'buy', payload: item });
      } else {
        console.error('Not enough money to buy this beverage');
      }
    }
  };

  return (
    <div>
      <button onClick={() => handleBuyButtonClick('coke', 10)}>구매</button>
      {beverage !== null && stock !== null && (
        <p>{beverage}: {stock} left</p>
      )}
      <p>Customer total: {customerTotal}</p>
    </div>
  );
}

export default Buy;
