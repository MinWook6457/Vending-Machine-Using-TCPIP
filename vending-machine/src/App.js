import React, { useEffect } from 'react';
import { Container, Row, Col, Navbar, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from 'axios'

import './App.css';

function Drink({ imageUrl, description, price }) {
  const handleSelect = () => {
    axios.post('/machine/selectedBeverage', { description, price }) // axios로 변경
    .then(response => {
      // 응답 처리
      if (response.status === 200) { // 응답이 성공했을 때
        console.log('음료가 선택되었습니다.');
      } else {
        console.error('음료 선택에 실패했습니다.');
      }
    })
    .catch(error => {
      // 에러 처리
      console.error('요청 중 오류가 발생했습니다.', error);
    });
  };


  return (
    <Col md={4} className="mb-4">
      <Card className="shadow-sm">
        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          <Card.Text>{description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Button variant="outline-secondary" size="sm"  onClick={handleSelect}>Select</Button>
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
  useEffect(() => {
    // 페이지가 로드될 때 데이터베이스에 데이터 삽입 요청 보내기
    axios.post('/machine/initialize')
      .then(response => {
        console.log(response)
        console.log('데이터베이스에 데이터가 성공적으로 삽입되었습니다.');
      })
      .catch(error => {
        console.error('데이터베이스 데이터 삽입에 실패했습니다.', error);
      });
  }, []);

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
            <Drink imageUrl="./water.png" description="water" price={450} />
            <Drink imageUrl="./coffee.png" description="coffee" price={500} />
            <Drink imageUrl="./sports.png" description="ionic" price={550} />
          </Row>
          <Row>
            <Drink imageUrl="./shake.png" description="shake" price={700} />
            <Drink imageUrl="./cola.png" description="cola" price={750} />
            <Drink imageUrl="./ade.png" description="ade" price={800} />
          </Row>
        </Container>
      </div>
      <footer className="text-muted">
        <Container>
          <p>Vending Machine Using SocketIO made by MinWook CSE 19</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
