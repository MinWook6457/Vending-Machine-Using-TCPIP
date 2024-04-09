// App.js

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

import './App.css';

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
    );
}

function App() {

    const [adminPassword, setAdminPassword] = useState('');
    const [stock, setStock] = useState(0);
    const [workerReady, setWorkerReady] = useState(false);

    useEffect(() => {
        // 초기 재고 조회
        handleStock('water');
    }, []);

    const handleWorkerMessage = (event) => {
        const { type, payload } = event.data;
        switch (type) {
          case 'stock':
            setStock(payload);
            break;
          default:
            console.error('Unknown message type:', type);
        }
    };

    const handleWorkerError = (error) => {
        console.error('Worker error:', error);
    };

    const workerRef = React.useRef(null);

    useEffect(() => {
        workerRef.current = new Worker('./worker.js');
        workerRef.current.onmessage = handleWorkerMessage;
        workerRef.current.onerror = handleWorkerError;

        // 웹 워커가 생성되었음을 표시
        setWorkerReady(true);

        return () => {
            workerRef.current.terminate();
        };
    }, []);

    const sendMessageToWorker = (type, payload) => {
        // 웹 워커가 준비되었을 때만 메시지를 보냄
        if (workerReady) {
            workerRef.current.postMessage({ type, payload });
        }else{
            
        }
    };

    const handleSelect = (description, price) => {
        sendMessageToWorker('select', { description, price });
    };

    const handleStock = (description) => {
        sendMessageToWorker('stock', { description });
    };

    const handleAdminPasswordChange = (event) => {
        setAdminPassword(event.target.value);
    };

    const handleAdminPasswordSubmit = (event) => {
        event.preventDefault();
        sendMessageToWorker('adminPassword', { password: adminPassword });
    };

    return (
        <div className="App">
            <header>
                <Navbar bg="dark" variant="dark" className="shadow-sm navbar-form">
                    <Container>
                        <Navbar.Brand>
                            <strong>Vending Machine</strong>
                        </Navbar.Brand>
                        <Form onSubmit={handleAdminPasswordSubmit} className="d-flex justify-content-end">
                            <Form.Label htmlFor="adminPassword" className="admin-label">Input admin password</Form.Label>
                            <Form.Control
                                type="password"
                                id="adminPassword"
                                aria-describedby="passwordHelpBlock"
                                className="admin-password"
                                value={adminPassword}
                                onChange={handleAdminPasswordChange}
                            />
                            <Button as="input" type="submit" value="입력" />
                        </Form>
                    </Container>
                </Navbar>
            </header>
            <div className="album py-5 bg-light">
                <Container>
                    <Row>
                        <Drink imageUrl="/water.png" description="water" price={450} handleSelect={handleSelect} handleStock={handleStock} stock={stock} />
                        <Drink imageUrl="/coffee.png" description="coffee" price={500} handleSelect={handleSelect} handleStock={handleStock} stock={stock} />
                        <Drink imageUrl="/sports.png" description="ionic" price={550} handleSelect={handleSelect} handleStock={handleStock} stock={stock} />
                    </Row>
                    <Row>
                        <Drink imageUrl="/shake.png" description="shake" price={700} handleSelect={handleSelect} handleStock={handleStock} stock={stock} />
                        <Drink imageUrl="/cola.png" description="cola" price={750} handleSelect={handleSelect} handleStock={handleStock} stock={stock} />
                        <Drink imageUrl="/ade.png" description="ade" price={800} handleSelect={handleSelect} handleStock={handleStock} stock={stock} />
                    </Row>
                </Container>
            </div>
            <footer className="text-muted">
                <Container>
                    <p>Vending Machine Using HTTP made by MinWook CSE 19</p>
                </Container>
            </footer>
        </div>
    );
}

export default App;
