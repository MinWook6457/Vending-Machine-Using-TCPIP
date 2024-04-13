import React from 'react';
import Drink from './Drink'; // Drink 컴포넌트를 가져오기

function Home() {
  return (
    <div>
      <h1>Welcome to Vending Machine</h1>
      <p>Please select a drink:</p>
      <div className="drink-list">
        <Drink name="Coffee" imageUrl="../img/coffee" description="coffee" price="2.50" />
        
        <Drink name="Ade" imageUrl="./ade.png" description="Ade" price="2.00" />
      </div>
    </div>
  );
}

export default Home;
