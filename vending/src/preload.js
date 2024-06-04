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

contextBridge.exposeInMainWorld('ipcRenderer',{
  ipcRenderer 
})

contextBridge.exposeInMainWorld('info', {
  getInfo: async () => {
    const dtoResult = await mainDTO('info', {});
    console.log('Info DTO:', dtoResult);
    return ipcRenderer.invoke('getInfo', dtoResult);
  }
});

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

    console.log(beverage,stock)

    const dtoResult = await mainDTO('buy', { beverage, stock : stock });
    console.log('buy DTO:', dtoResult.clientData);
    return ipcRenderer.invoke('getBuy', dtoResult.clientData);
  }
})