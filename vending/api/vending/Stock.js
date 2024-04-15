import React, { useState, useEffect } from 'react' 

function Stock() {
  const [stock, setStock] = useState(null) 
  const [worker, setWorker] = useState(null) 

  useEffect(() => {
    // 워커 생성
    const workerInstance = new Worker('../../worker.js')
    console.log('created worker`s instance' + workerInstance) 
    setWorker(workerInstance) 

    // 워커와 통신
    workerInstance.onmessage = function(event) {
      const { type, payload } = event.data 
      switch (type) {
        case 'stockResult':
          // 재고 처리 결과를 상태에 저장
          setStock(payload) 
          break 
        default:
          console.error('Unknown message type:', type) 
      }
    } 

    // 컴포넌트가 언마운트될 때 워커 종료
    return () => {
      workerInstance.terminate() 
    } 
  }, []) 

  const handleStockButtonClick = () => {
    if (worker) {
      worker.postMessage({ type: 'stock', payload: 'water' })  // 테스트
    }
  } 

  return (
    <div>
      <button onClick={handleStockButtonClick}>Check Stock</button>
      {stock !== null && <p>Stock: {stock}</p>}
    </div>
  ) 
}

export default Stock 
