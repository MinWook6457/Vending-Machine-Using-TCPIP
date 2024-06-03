import React, { useState } from 'react';
import Stock from '../vending/Stock';
import Buy from '../vending/Buy';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from './Image';

function Drink({ beverage, price, stock, setStock }) {
  const handleStockButtonClick = () => {
    console.log(`Checking stock for ${beverage}`);
  };

  const handleBuyButtonClick = () => {
    console.log(`구매 버튼 클릭`);
  };

  return (
    <Col md={10} className="mb-4">
      <Card className="shadow-sm" style={{ alignItems: 'center' }}>
        <Image name={beverage} />
        <Card.Body>
          <Card.Text>{beverage}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Stock beverage={beverage} stock={stock} onStockButtonClick={handleStockButtonClick} />
              <small className="text-muted">{stock}개</small>
            </div>
            <Buy beverage={beverage} stock={stock} setStock={setStock} onStockButtonClick={handleBuyButtonClick}/>
            <small className="text-muted">{price}원</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Drink;
