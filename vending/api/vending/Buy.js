import React, { useState } from 'react';

function Buy({ beverage, nowStock, price, inputCoin, updateInputCoin, updateDrinkStock}) {
  const [buyStock, setBuyStock] = useState(nowStock);

  const test = localStorage.getItem('isCheck');

  console.log(test)

  const buyDrink = async () => {
    if(test==='true'){
      alert('관리자 모드 활성화 중입니다. 음료를 구매할 수 없습니다.');
      return;
    }

    if (inputCoin < price) {
      alert('Not enough coins!');
      return;
    }

    if (buyStock === 0) {
      alert('Not enough stocks!');
      return;
    }

    try {
      const test = { beverage, stock: buyStock, price, inputCoin }; // buyStock 사용
      const response = await window.buy.getBuy(test);
      setBuyStock(response.remainingStock);
      updateDrinkStock(beverage, response.remainingStock);
      updateInputCoin(price);
      window.ipcRenderer.send('reloadAllWindows'); // 페이지 새로 고침 트리거
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
