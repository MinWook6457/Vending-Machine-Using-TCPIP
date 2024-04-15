import React from 'react' 
import Drink from './Drink'  // Drink 컴포넌트를 가져오기
import Stock from '../vending/Stock' 
import waterImage from '../../img/water.png' 
import adeImage from '../../img/ade.png' 
import sportsImage from '../../img/sports.png' 
import coffeeImage from '../../img/coffee.png' 
import colaImage from '../../img/cola.png' 
import shakeImage from '../../img/shake.png' 

const Home = () => {
  // 가상의 음료 데이터 배열
  const drinks = [
    { name: 'water', imageUrl: waterImage, description: '물', price: '$2.50' },
    { name: 'ade', imageUrl: adeImage, description: '에이드', price: '$3.00' },
    { name: 'coffee', imageUrl: coffeeImage, description: '커피', price: '$2.75' },
    { name: 'cola', imageUrl: colaImage, description: '콜라', price: '$3.50' },
    { name: 'shake', imageUrl: shakeImage, description: '쉐이크', price: '$2.90' },
    { name: 'sports', imageUrl: sportsImage, description: '스포츠음료', price: '$3.20' },
  ] 

  return (
    <div>
      <h1>Welcome to Vending Machine</h1>
      <p>Please select a drink:</p>
      <div className="drink-list">
        <div className="row">
          {drinks.slice(0, 3).map((drink, index) => (
            <div key={index} className="col-md-4">
              <Drink
                name={drink.name}
                imageUrl={drink.imageUrl}
                description={drink.description}
                price={drink.price}
                handleStock={() => Stock.handleStockButtonClick(drink.description)} // 재고 버튼 클릭 시 재고 확인 함수 호출
              />
            </div>
          ))}
        </div>
        <div className="row">
          {drinks.slice(3).map((drink, index) => (
            <div key={index} className="col-md-4">
              <Drink
                name={drink.name}
                imageUrl={drink.imageUrl}
                description={drink.description}
                price={drink.price}
                handleStock={() => Stock.handleStockButtonClick(drink.description)} // 재고 버튼 클릭 시 재고 확인 함수 호출
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) 
} 

export default Home 
