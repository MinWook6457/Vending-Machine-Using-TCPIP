import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import io from 'socket.io-client';
import Form from 'react-bootstrap/Form';

import './App.css';

const socket = io('http://localhost:8081', {
    path: '/socket.io' // 서버와 일치하는 경로 사용
});

function Drink({ imageUrl, description, price }) {
    const handleSelect = () => {
        axios.post('/machine/selectedBeverage', { description, price })
            .then(response => {
                if (response.status === 200) {
                    console.log('음료가 선택되었습니다.');
                } else {
                    console.error('음료 선택에 실패했습니다.');
                }
            })
            .catch(error => {
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
                            <Button variant="outline-secondary" size="sm" onClick={handleSelect}>Select</Button>
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
    const [selectedItem, setSelectedItem] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');
    const [socketId, setSocketId] = useState(null);


    useEffect(() => {
        socket.on('connect', () => {
        // 연결된 소켓의 ID를 상태로 저장
        setSocketId(socket.id);
        });

        socket.on('selectedBeverage', (data) => {
            console.log(data)

          
            setSelectedItem(data);  
            // 페이지가 로드될 때 데이터베이스에 데이터 삽입 요청 보내기     
        });
      
    }, [adminPassword]);

    axios.post('/machine/initialize')
    .then(response => {
        console.log(response);
        console.log('데이터베이스에 데이터가 성공적으로 삽입되었습니다.');
    })
    .catch(error => {
        console.error('데이터베이스 데이터 삽입에 실패했습니다.', error);
    });

    const handleAdminPasswordChange = (event) => {
        setAdminPassword(event.target.value);
    };

    const handleAdminPasswordSubmit = (event) => {
        event.preventDefault();

        axios.post('/admin/checkPassword', { password: adminPassword })
        .then(response => {
            console.log('관리자 모드 접속한 클라이언트 : ' + socketId)
            // 관리자 페이지로 이동
            console.log(response);
        })
        .catch(error => {
            console.error('비밀번호 확인 중 오류가 발생했습니다.', error);
        });
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
                        <Drink imageUrl="/water.png" description="water" price={450} />
                        <Drink imageUrl="/coffee.png" description="coffee" price={500} />
                        <Drink imageUrl="/sports.png" description="ionic" price={550} />
                    </Row>
                    <Row>
                        <Drink imageUrl="/shake.png" description="shake" price={700} />
                        <Drink imageUrl="/cola.png" description="cola" price={750} />
                        <Drink imageUrl="/ade.png" description="ade" price={800} />
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