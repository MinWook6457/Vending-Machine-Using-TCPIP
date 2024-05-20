const net = require('node:net')

const SERVER_IP = 'localhost'
const SERVER_PORT = 3001
let vendingInfo = 0;


console.log('클라이언트 실행')

const socket = net.createConnection({
    host: SERVER_IP,
    port: SERVER_PORT
}, () => {
    console.log('서버에 연결되었습니다.');

});

socket.on('data', async(data) => {
    console.log('recieved data for server:', data);
   // test = JSON.parse(data.toString())
    const t = JSON.parse(JSON.stringify(data.toString()))
    vendingInfo = t
    console.log('test data : ' + t)
});

socket.on('close', () => {
    console.log('서버와의 연결이 종료되었습니다.');
});

socket.on('error', (err) => {
    console.error('에러 발생:', err);
});

socket.on('connect',() => {
    console.log('connect test')

    socket.write('data')
})

function getVendingInfo(){
    return vendingInfo
}

module.exports = {socket, getVendingInfo}