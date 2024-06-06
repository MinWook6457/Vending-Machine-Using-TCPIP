
import React, { useEffect, useRef, useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from './Image';
import Buy from '../vending/Buy';
import soldOut from '../../img/soldout.png';

function Drink({ beverage, price, stock, inputCoin, updateInputCoin, updateDrinkStock, isEmptyStock }) {
  const target = useRef(null);
  const [currentStock, setCurrentStock] = useState(stock); // 현재 재고 상태를 useState를 사용해 관리
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    setCurrentStock(stock); // 부모 컴포넌트로부터 받아온 stock 값이 변경될 때마다 currentStock을 업데이트
    setIsSoldOut(stock === 0);
  }, [stock]);

  return (
    <Col md={10} className="mb-4">
      <Card className="shadow-sm" style={{ alignItems: 'center', position: 'relative' }}> 
        {isSoldOut === true && (
           <img src={soldOut} alt="Sold Out" style={{ position: 'absolute', width : 250 , opacity :'0.5'}} />
        )}
        <div ref={target}>
          <Image name={beverage} />
        </div>
        <Card.Body>
          <Card.Text>{beverage}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Buy
              beverage={beverage}
              nowStock={currentStock} // 현재 재고 상태를 Buy 컴포넌트로 전달
              price={price}
              inputCoin={inputCoin}
              updateInputCoin={updateInputCoin}
              updateDrinkStock={updateDrinkStock}
            />
            <small className="text-muted">{price}원</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Drink;
