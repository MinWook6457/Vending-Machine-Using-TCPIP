import React, { useState, useEffect } from 'react';
import Drink from './Drink';  // Drink 컴포넌트를 가져오기

const Home = () => {
  const [drinks, setDrinks] = useState([]);

  const fetchDrinks = async () => {
    try {
      const response = await window.info.getInfo();
      const drinkData = JSON.parse(response);
      console.log(drinkData);
      setDrinks(drinkData);
    } catch (error) {
      console.error('Failed to fetch drink data:', error);
    }
  };
  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <div>
      <div>
        <button onClick={fetchDrinks}>Init Drinks</button>
      </div>
      <div className="drink-list">
        <div className="row">
          {drinks.map((drink, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Drink
                beverage={drink.beverage}
                price={drink.price}
                stock={drink.stock}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
