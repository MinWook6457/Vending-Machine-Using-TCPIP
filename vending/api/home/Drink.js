import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Drink({ imageUrl, description, price, stock, handleSelect, handleStock }) {
    return (
      <Col md={4} className="mb-4">
      <Card className="shadow-sm">
          <Card.Img variant="top" src={imageUrl} />
          <Card.Body>
              <Card.Text>{description}</Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                      <Button variant="outline-secondary" size="sm" onClick={() => handleSelect(description, price)}>선택</Button>
                      <Button variant="outline-secondary" size="sm" onClick={() => handleStock(description)}>재고</Button>
                      <small className="text-muted">{stock}개</small>
                  </div>
                  <small className="text-muted">{price}원</small>
              </div>
          </Card.Body>
      </Card>
    </Col> 
  )
}
export default Drinks;
