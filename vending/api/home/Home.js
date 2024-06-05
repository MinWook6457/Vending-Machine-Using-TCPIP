import React, { useState, useEffect } from 'react';
import Drink from './Drink';
import MoneyImage from './MoneyImage';

const Home = () => {
  const [drinks, setDrinks] = useState([]);
  const [inputCoin, setInputCoin] = useState(0);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await window.info.getInfo();
        // console.log(response)
        // const drinkData = JSON.parse(response);
        setDrinks(response);
      } catch (error) {
        console.error('Failed to fetch drink data:', error);
      }
    };

    fetchDrinks();
  }, []);

  const coinClick = (value, name) => {
    window.ipcRenderer.invoke('getCoin', {value,name} );
    setInputCoin(prevInputCoin => prevInputCoin + value);
  };

  return (
    <div>
      <div className="drink-list">
        <div className="row">
          {drinks &&
            drinks.map((drink, index) => (
              <div key={index} className="col-md-4 mb-4">
                <Drink beverage={drink.beverage} price={drink.price} stock={drink.stock} />
              </div>
            ))}
        </div>
      </div>
      <div className="money-image-list d-flex justify-content-center">
        <div className="row">
          <div className="col-md-2">
            <button onClick={() => coinClick(10,"ten")}>
              <MoneyImage name="ten" />
            </button>
            <div>$10</div>
          </div>
          <div className="col-md-2">
            <button onClick={() => coinClick(50,"fifty")}>
              <MoneyImage name="fifty" />
            </button>
            <div>$50</div>
          </div>
          <div className="col-md-2">
            <button onClick={() => coinClick(100,"oneHundred")}>
              <MoneyImage name="oneHundred" />
            </button>
            <div>$100</div>
          </div>
          <div className="col-md-2">
            <button onClick={() => coinClick(500,"fiveHundred")}>
              <MoneyImage name="fiveHundred" />
            </button>
            <div>$500</div>
          </div>
          <div className="col-md-2">
            <button onClick={() => coinClick(1000,"oneThousand")}>
              <MoneyImage name="oneThousand" />
            </button>
            <div>$1000</div>
          </div>
        </div>
      </div>
      <div>
        <h1>투입된 금액 : {inputCoin}</h1>
      </div>
    </div>
  );
};

export default Home;
