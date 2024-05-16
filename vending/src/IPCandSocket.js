// ipcAndSocket.js (IPC 및 TCP 소켓 통신 코드)

const { ipcMain } = require('electron');
const net = require('net');

// IPC로부터 음료 정보를 받아서 TCP 소켓을 통해 백엔드로 전송
ipcMain.on('selected-drink', (event, drink) => {
  const drinkData = JSON.stringify({ name: drink, price: 1000, stock: 10 });

  const client = net.createConnection({ port: 3000 }, () => {
    console.log('Connected to backend server');
    client.write(drinkData);
  });

  client.on('data', (data) => {
    console.log('Received from backend:', data.toString());
    client.end();
  });

  client.on('end', () => {
    console.log('Disconnected from backend server');
  });

  client.on('error', (err) => {
    console.error('Socket error:', err);
  });
  
});
