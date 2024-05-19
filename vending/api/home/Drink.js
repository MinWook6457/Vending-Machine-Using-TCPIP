import React from 'react' 
import Stock from '../vending/Stock'
import Buy from '../vending/Buy'
import { Card, Button, Col } from 'react-bootstrap'  
import 'bootstrap/dist/css/bootstrap.min.css'
function Drink({ beverage,imageURL, price, stock}) {
  console.log(imageURL)

  return (
    <Col md={10} className="mb-4">
      <Card className="shadow-sm">
        <Card.Img variant="top" src={imageURL} alt={beverage}/>
        <Card.Body>
          <Card.Text>{beverage}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Stock />
              <small className="text-muted">{stock}개</small>
            </div>
              <Buy />
            <small className="text-muted">{price}원</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ) 
}

export default Drink 
