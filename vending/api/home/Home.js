import React from 'react';
import Drink from './Drink'; // Drink 컴포넌트를 가져오기
import coffeeImage from "../../img/coffee.png";
import adeImage from "../../img/ade.png";

function Home() {
  return (
    <div>
      <h1>Welcome to Vending Machine</h1>
      <p>Please select a drink:</p>
      <div className="drink-list">
        <Drink name="Coffee" imageUrl={coffeeImage} description="coffee" price="2.50" />
        <Drink name="Ade" imageUrl={adeImage} description="Ade" price="2.00" />
      </div>
    </div>
  );
}

export default Home;
