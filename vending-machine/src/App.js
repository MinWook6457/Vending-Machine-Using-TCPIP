import React from 'react';
import { Container, Row, Col, Navbar, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 




import './App.css';

function Drink({ imageUrl, description, price }) {
  return (
    <Col md={4} className="mb-4">
      <Card className="shadow-sm">
        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          <Card.Text>{description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Button variant="outline-secondary" size="sm">View</Button>
              <Button variant="outline-secondary" size="sm">Edit</Button>
            </div>
            <small className="text-muted">{price}원</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

function App() {
  return (
    <div className="App">
      <header>
        <Navbar bg="dark" variant="dark" className="shadow-sm">
          <Container>
            <Navbar.Brand>
              <strong>Vending Machine</strong>
            </Navbar.Brand>
          </Container>
        </Navbar>
      </header>
      <div className="album py-5 bg-light">
        <Container>
          <Row>
            <Drink imageUrl="./water.png" description="물이에용!!" price={450} />
            <Drink imageUrl="./coffee.png" description="아이스 아메리카노 입니다." price={500} />
            <Drink imageUrl="./sports.png" description="이온 음료 입니다 ㅎㅎ" price={550} />
          </Row>
          <Row>
            <Drink imageUrl="./shake.png" description="딸기 와 우유를 섞은 딸기 쉐이크 입니다." price={700} />
            <Drink imageUrl="./sports.png" description="이온음료입니다." price={750} />
            <Drink imageUrl="./ade.png" description="특화 에이드" price={800} />
          </Row>
        </Container>
      </div>
      <footer className="text-muted">
        <Container>
          <p>Album example is © Bootstrap, but please download and customize it for yourself!</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
