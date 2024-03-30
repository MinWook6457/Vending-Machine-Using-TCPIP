// require('dotenv').config()

const express = require("express");
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')

// 라우터 설정
// const openaiRouter = require('./api/openai/route.openai')

const machineRouter = require('./machine/route.machine')

const port = 8081;

const app = express();
app.use(express.json());
app.use(cors({
  origin : 'http://localhost:3000', // 클라이언트 url 허용
  methods: ['GET', 'POST'], // 
  credentials: true // 인증 정보를 전달.
}));

const { sequelize } = require('./models/index');  

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });



const server = http.createServer(app)

// Socket.IO 서버 생성 및 경로 설정
const io = socketIo(server, {
  path: '/socket.io', // 클라이언트와 일치하는 경로 사용
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 클라이언트 연결 시
io.on('connection', (socket) => {
  console.log(`클라이언트가 연결되었습니다. Socket ID: ${socket.id}`);
});


// 라우팅
// app.use("/openai", openaiRouter)
app.use("/machine", machineRouter)


server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = io;