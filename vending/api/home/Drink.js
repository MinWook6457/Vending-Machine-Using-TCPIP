import React, { useEffect, useRef, useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from './Image';
import Buy from '../vending/Buy';
import soldOut from '../../img/soldout.png';

function Drink({ beverage, price, stock, inputCoin, updateInputCoin, updateDrinkStock }) {
  const target = useRef(null);
  const [currentStock, setCurrentStock] = useState(stock);
  const [isSoldOut, setIsSoldOut] = useState(stock === 0);

  useEffect(() => {
    setCurrentStock(stock);
    const hasReloaded = localStorage.getItem(`reload-${beverage}`);

    if (stock === 0 && !hasReloaded) {
      setIsSoldOut(true);
      localStorage.setItem(`reload-${beverage}`, true);
      window.ipcRenderer.send('reloadAllWindows');
    } else if (stock > 0) {
      setIsSoldOut(false);
      localStorage.removeItem(`reload-${beverage}`);
    }
  }, [stock, beverage]);

  return (
    <Col md={10} className="mb-4">
      <Card className="shadow-sm" style={{ alignItems: 'center', position: 'relative' }}>
        {isSoldOut && (
          <img src={soldOut} alt="Sold Out" style={{ position: 'absolute', width: 250, opacity: '0.5' }} />
        )}
        <div ref={target}>
          <Image name={beverage} />
        </div>
        <Card.Body>
          <Card.Text>{beverage}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Buy
              beverage={beverage}
              nowStock={currentStock}
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
