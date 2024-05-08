import React from 'react' 
import Stock from '../vending/Stock'
import { Card, Button, Col } from 'react-bootstrap'  
import 'bootstrap/dist/css/bootstrap.min.css'


function Drink({ imageUrl, description, price, stock}) {
   console.log('Drink 컴포넌트 호출')

  return (
    <Col md={10} className="mb-4">
      <Card className="shadow-sm">
        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          <Card.Text>{description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Stock />
              <small className="text-muted">{stock}개</small>
            </div>
            <small className="text-muted">{price}원</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ) 
}

export default Drink 
