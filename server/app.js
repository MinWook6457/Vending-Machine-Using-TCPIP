// server.js

const net = require('net');
const { sequelize } = require('./models/index');
const port = 8081;


const adminController = require('./admin/controller.admin/admin');

// Sequelize와 연결
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err);
  });


// TCP 서버 생성
const server = net.createServer((socket) => {
    // 클라이언트로부터 데이터를 받았을 때 발생하는 이벤트 핸들러
    socket.on('data', (data) => {
        const requestData = data.toString();
        // 클라이언트 요청을 파싱하고 적절한 요청 처리 함수 호출
        handleAdminRequest(requestData, socket);
    });
});

// 서버가 특정 포트에서 클라이언트의 연결을 받도록 함
server.listen(8080, () => {
    console.log('TCP 서버가 8080 포트에서 실행 중입니다.');
});

// 클라이언트 요청 처리 함수
function handleAdminRequest(requestData, socket) {
    const [method, path] = parseRequest(requestData);
    // 요청 메서드와 경로에 따라 적절한 처리 함수 호출
    if (method === 'POST' && path === '/admin/checkPassword') {
        // POST /admin/checkPassword 요청 처리
        adminController.loginAdmin(socket);
    } else {
        // 잘못된 요청 처리
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.write('404 Not Found');
        socket.end();
    }
}

// 요청을 파싱하는 함수
function parseRequest(requestData) {
    // 간단한 파싱 로직 구현
    const lines = requestData.split('\n');
    const [method, path] = lines[0].split(' ');
    return [method, path];
}
