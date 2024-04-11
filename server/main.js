const net = require('net');

const server = net.createServer((socket) => {
  console.log('클라이언트가 연결되었습니다.');

  socket.on('data', (data) => {
    console.log('클라이언트로부터 받은 메시지:', data.toString());

    // 클라이언트에 응답 전송
    socket.write('서버에서의 응답');
  });

  socket.on('end', () => {
    console.log('클라이언트가 연결을 종료했습니다.');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
