const net = require('net');

// 서버 정보
const HOST = 'localhost';
const PORT = 3000;

// 소켓 생성 및 서버에 연결
const client = new net.Socket();
client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  // 서버에 메시지 보내기 (재고 확인 요청 등)
  const message = 'stock';
  client.write(message);
});

// 서버로부터 데이터를 받았을 때 처리
client.on('data', data => {
  console.log('Received:', data.toString());

  // 서버로부터 받은 데이터를 처리 (재고 확인 결과 등)
  const stockCount = parseInt(data.toString());
  console.log('Stock count:', stockCount);

});

// 연결이 종료됐을 때 처리
client.on('close', () => {
  console.log('Connection closed');
});
