// worker.js (워커)

const { parentPort } = require('worker_threads');
const net = require('net');

// TCP 서버 설정
const server = net.createServer((socket) => {
  console.log('Client connected to TCP server');

  socket.on('data', (data) => {
    console.log('Received from TCP client:', data.toString());
  });

  socket.write('Hello from TCP server');
});

server.on('error', (err) => {
  console.error('TCP server error:', err);
});

server.listen(3000, () => {
  console.log('TCP server listening on port 3000');
});

// 메인 프로세스로 메시지 전송
parentPort.postMessage('Hello from worker');
