import React, { useState, useEffect } from 'react';
import Drink from './Drink';
import MoneyImage from './MoneyImage';
import changeImg from '../../img/change.png'

const Home = () => {
  const [drinks, setDrinks] = useState([]);
  const [inputCoin, setInputCoin] = useState(0);
  const [drinkStocks, setDrinkStocks] = useState({}); // 각 음료수의 재고를 관리하기 위한 상태
  const [oneThousandCount, setOneThousandCount] = useState(0);

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await window.info.getInfo();
        setDrinks(response);

        // 음료수의 초기 재고 상태 설정
        const initialStocks = response.reduce((acc, drink) => {
          
          acc[drink.beverage] = drink.stock;
          return acc;
        }, {});
        setDrinkStocks(initialStocks);
      } catch (error) {
        console.error('Failed to fetch drink data:', error);
      }
    };

    fetchDrinks();
  }, []);

  const coinClick = (value, name) => {
    window.ipcRenderer.invoke('getCoin', { value, name });
    if(value === 1000){
      setOneThousandCount(preCount => preCount + 1 );
      if(oneThousandCount > 4){
        alert('1000원 권은 최대 5장만 투입 가능합니다!');
        return;
      }
    }else{
      if(inputCoin + value > 7000){
        alert('투입금은 최대 7000원!');
        return;
      }
    }
    setInputCoin(prevInputCoin => prevInputCoin + value );
  };

  const updateInputCoin = (amount) => {
    setInputCoin(prevInputCoin => prevInputCoin - amount);
  };

  const updateDrinkStock = (beverage, newStock) => {
    setDrinkStocks(prevStocks => ({
      ...prevStocks,
      [beverage]: newStock
    }));
  };

  const changeCoinClick = async (inputCoin) => { 
    const response = await window.ipcRenderer.invoke('getChange', { inputCoin });
    console.log(response);
    const parseResponse = JSON.parse(JSON.stringify(response));

    const totalChange = Object.entries(parseResponse.change)
    .reduce((total, [coin, count]) => {
      const coinValue = parseInt(coin);
      const coinCount = parseInt(count);
      console.log(`Coin: ${coin}, Count: ${count}, Coin Value: ${coinValue}, Coin Count: ${coinCount}`);
      
      if (!isNaN(coinValue) && !isNaN(coinCount)) {
        return total + (coinValue * coinCount);
      } else {
        console.error(`Invalid coin or count value: Coin - ${coin}, Count - ${count}`);
        return total;
      }
    }, 0);

    console.log(totalChange);
    setInputCoin(prevInputCoin => prevInputCoin - totalChange);
  }


  const inputPassword = (e) => {
    setPassword(e.target.value);
  };

  const inputPasswordSubmit = async () => {
    try{
      console.log(password)

      const response = await window.ipcRenderer.invoke('checkPassword', {password});
      if(response.success){
        alert('관리자 모드 진입 성공')
        window.location.hash = "#/admin";
      }else{
        alert('관리자 모드 진입 실패')
      }
    }catch(error){

    }
  }


  return (
    <div>
      <div className="drink-list">
        <div className="row">
          {drinks.map((drink, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Drink
                beverage={drink.beverage}
                price={drink.price}
                stock={drinkStocks[drink.beverage] || drink.stock}
                inputCoin={inputCoin}
                updateDrinkStock={updateDrinkStock}
                updateInputCoin={updateInputCoin}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="money-image-list d-flex justify-content-center">
        <div className="row">
          {[
            { value: 10, name: "ten" },
            { value: 50, name: "fifty" },
            { value: 100, name: "oneHundred" },
            { value: 500, name: "fiveHundred" },
            { value: 1000, name: "oneThousand" },
          ].map(({ value, name }, index) => (
            <div key={index} className="col-md-2">
              <button onClick={() => coinClick(value, name)}>
                <MoneyImage name={name} />
              </button>
              <div>${value}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='money d-flex justify-content-center'>
          <div className='row'>
           <h3> 투입된 금액: {inputCoin}  </h3>
        <button onClick={() => changeCoinClick(inputCoin)}> 
            <img src={changeImg} width={100}></img>
        </button>        
          </div>
         </div>
      </div>
          <div className='admin d-flex justify-content-center'>
           <h3> 관리자 모드 :{' '} 
           <input type="password" 
           name="userPassword" 
           placeholder="password"  
           value={password}
           onChange={inputPassword}>
            </input></h3>
           <button onClick={inputPasswordSubmit}>진입</button>
          <p>{message}</p>
          </div>
    </div>
  );
};

export default Home;
