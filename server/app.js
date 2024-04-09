const net = require('net');

// 서버 생성
const server = net.createServer((socket) => {
  console.log('클라이언트가 연결되었습니다.');

  // 클라이언트로부터 메시지 수신
  socket.on('data', (data) => {
    console.log('서버에서 메시지를 수신했습니다:', data.toString());

    // 클라이언트로 응답 전송
    socket.write('서버에서의 응답');
  });

  // 클라이언트 연결 종료
  socket.on('end', () => {
    console.log('클라이언트가 연결을 종료했습니다.');
  });
});

// 서버 리스닝
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
