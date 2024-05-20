import React from 'react';
import Stock from '../vending/Stock';
import Buy from '../vending/Buy';
import { Card, Button, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from './Image';

function Drink({ beverage, price, stock }) {
  return (
    <Col md={10} className="mb-4">
      <Card className="shadow-sm" style={{alignItems:'center'}}>
        {/* <Card.Img variant="top" src={} alt={beverage} /> */}
        {/* {React.createElement(test[beverage])} */}
        <Image name={beverage} />
        <Card.Body>
          <Card.Text>{beverage}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Stock stock={stock}/>
              <small className="text-muted">{stock}개</small>
            </div>
            <Buy beverage={beverage}/>
            <small className="text-muted">{price}원</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Drink;
