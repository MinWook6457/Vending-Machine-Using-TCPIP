﻿import React, { useState, useEffect } from 'react';
import Drink from './Drink';
import MoneyImage from './MoneyImage';
import changeImg from '../../img/change.png';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const Home = () => {
  const [drinks, setDrinks] = useState([]);
  const [inputCoin, setInputCoin] = useState(0);
  const [drinkStocks, setDrinkStocks] = useState({});
  const [oneThousandCount, setOneThousandCount] = useState(0);
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [changePassword,setChangePassword] = useState('');
  const [message, setMessage] = useState('');
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await window.ipcRenderer.invoke('getInfo', {});
        setDrinks(response);
        const initialStocks = response.reduce((acc, drink) => {
          acc[drink.beverage] = drink.stock;
          return acc;
        }, {});
        setDrinkStocks(initialStocks);
      } catch (error) {
        console.error('Failed to fetch drink data:', error);
      }
    };

    const savedLocalInputCoin = localStorage.getItem('inputCoin');
    setInputCoin(Number(savedLocalInputCoin) || 0);

    const savedThousandCount = localStorage.getItem('oneThousandCount');
    setOneThousandCount(Number(savedThousandCount) || 0);

    const savedIsCheck = localStorage.getItem('isCheck');
    setIsCheck(savedIsCheck === 'true');

    fetchDrinks();

    const handleStorageChange = (event) => {
      if (event.key === 'isCheck') {
        setIsCheck(event.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isCheck', isCheck);
  }, [isCheck]);

  const coinClick = (value, name) => {
    if (isCheck) {
      alert('관리자 모드 활성화 중입니다. 코인을 투입할 수 없습니다.');
      return;
    }

    if (value === 1000) {
      if (oneThousandCount >= 4) {
        alert('1000원 권은 최대 5장만 투입 가능합니다!');
        return;
      } else {
        setOneThousandCount(prevCount => {
          const newCount = prevCount + 1;
          localStorage.setItem('oneThousandCount', newCount);
          return newCount;
        });
      }
    } else {
      if (inputCoin + value > 7000) {
        alert('투입금은 최대 7000원!');
        return;
      }
    }

    const updatedCoin = inputCoin + value;
    setInputCoin(updatedCoin);
    localStorage.setItem('inputCoin', updatedCoin);
    window.ipcRenderer.send('reloadAllWindows'); // 페이지 새로 고침 트리거
  };

  const updateInputCoin = (amount) => {
    const updatedCoin = inputCoin - amount;
    localStorage.setItem('inputCoin', updatedCoin);
    setInputCoin(updatedCoin);
  };

  const updateDrinkStock = (beverage, newStock) => {
    setDrinkStocks(prevStocks => ({
      ...prevStocks,
      [beverage]: newStock
    }));
  };

  const changeCoinClick = async () => {
    if (isCheck) {
      alert('관리자 모드 활성화 중입니다. 거스름돈을 받을 수 없습니다.');
      return;
    }

    const response = await window.ipcRenderer.invoke('getChange', { inputCoin });

    console.log(response);

    if(response.success === false){
      alert('거스름돈이 부족합니다.');
      return;
    }

    const parseResponse = JSON.parse(JSON.stringify(response));

    const totalChange = Object.entries(parseResponse.change).reduce((total, [coin, count]) => {
      const coinValue = parseInt(coin);
      const coinCount = parseInt(count);
      return total + (coinValue * coinCount);
    }, 0);

    const updatedCoin = inputCoin - totalChange;
    localStorage.setItem('inputCoin', updatedCoin);
    setInputCoin(updatedCoin);
    window.ipcRenderer.send('reloadAllWindows', {});
  };

  const inputPassword = (e) => {
    setPassword(e.target.value);

  };

  const inputCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const inputChangePassword = (e) => {
    setChangePassword(e.target.value);
  }

  const inputPasswordSubmit = async () => {
    try {
      const response = await window.ipcRenderer.invoke('checkPassword', { password });
      if (response.success) {
        alert('관리자 모드 진입 성공');
        setIsCheck(true);
        localStorage.setItem('isCheck', 'true');
        setMessage('관리자 모드 활성화');
      } else {
        alert('관리자 모드 진입 실패');
      }
    } catch (error) {
      console.log('관리자 모드 진입 실패');
    }
  };

  const handleChangePassword = async () => {
    try {
      console.log(password)
      console.log( changePassword);

      const response = await window.ipcRenderer.invoke('changePassword', {currentPassword: currentPassword, changePassword: changePassword});

      console.log(response);

      if (response.success) {
        alert('관리자 비밀 번호 변경 완료');
      } else {
        alert('관리자 비밀 번호 변경 실패');
      }
    } catch (error) {
      console.log('관리자 모드 진입 실패');
    }
  }

  const inputMakeUpVending = async () => {
    window.location.hash = "#/admin";
  };

  const refreshDrinks = async () => {
    const response = await window.ipcRenderer.invoke('refresh', {});

    if (response.success) {
      const updatedDrinks = response.data;
      setDrinks(updatedDrinks);
      const updatedStocks = updatedDrinks.reduce((acc, drink) => {
        acc[drink.beverage] = drink.stock;
        return acc;
      }, {});
      setDrinkStocks(updatedStocks);
      alert('재고가 성공적으로 보충되었습니다.');
      window.ipcRenderer.send('reloadAllWindows', {});
    } else {
      alert('재고 보충에 실패했습니다.');
    }
  };

  const offAdmin = () => {
    setIsCheck(false);
    localStorage.setItem('isCheck', 'false');
    alert('관리자 모드 종료');
  };

  const FilledCoin = async() => {
    const response = await window.ipcRenderer.invoke('filledCoin', {});

    if(response.success){
      alert('잔돈 채우기 완료')
    }else{
      alert('잔돈 채우기 실패');
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
              <div>{value}원</div>
            </div>
          ))}
        </div>
      </div>
      <Container>
      <Row>
        <div className='money d-flex justify-content-center'>
          <div>
            <h3> 투입된 금액: {inputCoin} </h3>
          </div>
        </div>
        <div className='change d-flex justify-content-center'>
        <button onClick={() => changeCoinClick(inputCoin)}>
            <img src={changeImg} width={100} alt="Change" />
          </button>
        </div>
      </Row>

      </Container>
    <Container>
      <Row className='admin d-flex justify-content-center'>
        <h3> 관리자 모드 :{' '}
          <Form.Control
            type="password"
            name="userPassword"
            placeholder="password"
            value={password}
            onChange={inputPassword}
          />
        </h3>
        <div>
          <Button onClick={inputPasswordSubmit}>진입</Button>          
        </div>
        {isCheck &&
          <div>
            <p>{message}</p>
            <div>
              <Button onClick={inputMakeUpVending}>통계</Button>
            </div>
            <div>
              <Button onClick={refreshDrinks}>재고 보충</Button>
            </div>
            <h3> 비밀번호 변경 :{' '}
              <Form.Control
                type="password"
                name="currentPassword"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={inputCurrentPassword}
              />
              <Form.Control
                type="password"
                name="changePassword"
                placeholder="새로운 비밀번호"
                value={changePassword}
                onChange={inputChangePassword}
              />
            </h3>
            <div>
              <Button onClick={handleChangePassword}>변경</Button>          
            </div>
            <div>
              <Button onClick={FilledCoin}>잔돈 채우기</Button>          
            </div>
            <div>
              <Button onClick={offAdmin}>종료</Button>
            </div>
          </div>
        }
      </Row>
    </Container>
    </div>
  );
};

export default Home;
