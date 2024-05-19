const net = require('net')

const SERVER_IP = 'localhost'
const SERVER_PORT = 3001

const socket = net.createConnection({
    host: SERVER_IP,
    port: SERVER_PORT
}, () => {
    console.log('서버에 연결되었습니다.');

    if (test) {
        socket.write(JSON.stringify(test));
      } else {
        socket.write('클라이언트를 찾을 수 없습니다.');
      }
      
});

socket.on('data', (data) => {
    console.log('서버로부터 받은 데이터:', data);
});

socket.on('close', () => {
    console.log('서버와의 연결이 종료되었습니다.');
});

socket.on('error', (err) => {
    console.error('에러 발생:', err);
});