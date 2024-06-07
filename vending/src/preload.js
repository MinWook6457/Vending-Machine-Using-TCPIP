const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

const mainDTO = async (command, data) => {
  const hash = uuidv4();
  const clientData = {
    hash: hash,
    command: command,
    vendingId: "",
    clientData: data
  };
  return clientData;
};

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

// contextBridge.exposeInMainWorld('info', {
//   getInfo: async () => {
//     const dtoResult = await mainDTO('info', {});
//     console.log('Info DTO:', dtoResult);
//     return ipcRenderer.invoke('getInfo', dtoResult);
//   }
// });

contextBridge.exposeInMainWorld('stock', {
  getStock: async () => {
    const dtoResult = await mainDTO('stock', {});
    console.log('stock DTO:', dtoResult);
    return ipcRenderer.invoke('getStock', dtoResult);
  }
});

contextBridge.exposeInMainWorld('buy', {
  getBuy: async (payload) => {
    const beverage = payload.beverage;
    const stock = payload.stock;
    const price = payload.price;
    const inputCoin = payload.inputCoin;
    console.log(beverage,stock,price,inputCoin)

    const dtoResult = await mainDTO('buy', { beverage, stock : stock , price , inputCoin });
    console.log('buy DTO:', dtoResult.clientData);
    return ipcRenderer.invoke('getBuy', dtoResult.clientData);
  }
})

// contextBridge.exposeInMainWorld('coin',{
//   getCoin : async(payload) => {
//     const {value , name} = payload;
//     const dtoResult = await mainDTO('coin',{value : value, name : name});
//     return ipcRenderer.invoke('getCoin',dtoResult);
//   }
// })