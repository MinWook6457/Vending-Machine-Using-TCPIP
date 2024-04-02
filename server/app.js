// server.js

const net = require('net');
const { createServer } = require('./server');
const { sequelize } = require('./models/index');
const port = 8081;

// TCP 서버 생성
const server = createServer();

// 포트 바인딩 및 리스닝
server.listen(port, () => {
  console.log(`TCP 서버가 포트 ${port}에서 실행 중입니다.`);
});

// Sequelize와 연결
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err);
  });
