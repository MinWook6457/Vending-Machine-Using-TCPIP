
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

## Fisrt

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

This is example...

```bash
await window.ipcRenderer.invoke('channel', {});
```

## License
MIT © 
