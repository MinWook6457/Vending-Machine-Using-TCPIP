
import React, { useState } from 'react';

function Buy({ beverage, nowStock, price, inputCoin, updateInputCoin, updateDrinkStock }) {
  const [buyStock, setBuyStock] = useState(nowStock);

  const buyDrink = async () => {
    if (inputCoin < price) {
      alert('Not enough coins!');
      return;
    }

    if(buyStock === 0){
      alert('not Enough stocks!');
      return;
    }

    try {
      const test = { beverage, stock: buyStock, price, inputCoin }; // buyStock 사용
      const response = await window.buy.getBuy(test);
      setBuyStock(response.remainingStock);
      updateInputCoin(price);
      updateDrinkStock(beverage, response.remainingStock);
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
