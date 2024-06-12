
<p>
  Electron + React && node JS
  Vending Machine using TCP/IP
</p>

## Install
Clone the repo and install dependencies:

```bash
git clone --branch master https://github.com/MinWook6457/Vending-Machine-Using-TCPIP.git
cd server
npm install
cd ..
cd vending
npm install
```

**Having issues installing? Contact me [Email](minuk6457@gmail.com)**

## Starting Development

Start the app in the `dev` environment:

```bash
cd server
npm start or pm2 start (set PM2 on this Project)
cd ..
cd vending
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

**Rendering and Communicate to Socket**

## First

Open IPCRenderer Channel in preload

```bash
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  send : (channel, ...args) => {
    ipcRenderer.send(channel, ...args);  
  }
});
```

## So, I can use it

window.ipcRenderer.[channel]('...args')

Example ...

```bash
await window.ipcRenderer.invoke('channel', {});
```

## in Main Process 

use handle function and get response

Example ...

```bash
  ipcMain.handle('getBuy', async (event, payload) => {
    const { beverage, stock , price, inputCoin} = payload;
    console.log(beverage, stock, price, inputCoin);
    try {
      const response = await buyDrink(beverage, stock, price, inputCoin);
      return response;
    } catch (error) {
      console.error('Error in getBuy handler:', error);
      return { success: false, message: error.message };
    }
  });
```

## await function listen to client

use Promise and using socket write data to server

Example ...

```bash
function buyDrink(beverage, stock, price, inputCoin) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({ beverage, stock, price, inputCoin });
        socket.write(`buy${payload}`);
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}
```

## server socket listen data and substring prefix 

Example ...

```bash
  if (data.startsWith('input')) {
            const payload = data.substring(5);
            .
            .
            .
```

## Run Back-End logic and returned results to client

Example ...

```bash
  if (data.startsWith('makeUpCoin')) {
            try {
                const coinData = await Coin.findAll({
                    attributes: ['unit', 'price', 'change'],
                });
                const refreshData = JSON.stringify(coinData);
                socket.write(JSON.stringify({success: true, message: '전체 화폐 데이터 전달', refreshData}));
            } catch (err) {
                socket.write(JSON.stringify({success: false, message: '화폐 데이터 전달 중 에러'}));
            }
        }
```

## STACK

<img src="https://img.shields.io/badge/Electron-#47848F?style=for-the-badge&logo=Electron&logoColor=white">
<img src="https://img.shields.io/badge/Sequelize-##52B0E7?style=for-the-badge&logo=Sequelize-&logoColor=white">


## License
MIT © 
