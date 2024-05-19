const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

// Create a DTO (Data Transfer Object) with a unique hash, command, and data.
const mainDTO = async (command, data) => {
  const hash = uuidv4();

  console.log(hash)

  const clientData = {
    hash: hash,
    command: command,
    vendingId: "", // Set your vendingId if needed
    clientData: data
  };
  return clientData;
};

contextBridge.exposeInMainWorld('stock', {
  getStock: async (stock) => {
    const dtoResult = await mainDTO('stock', stock);

    console.log('Stock DTO:', dtoResult);
    return ipcRenderer.invoke('getStock', dtoResult);
  },
  onStockResponse: (callback) => ipcRenderer.on('stock-response', callback)
});

contextBridge.exposeInMainWorld('buy', {
  getBuy: async (buy) => {
    const dtoResult = await mainDTO('buy', buy);
    console.log('Buy DTO:', dtoResult);
    return ipcRenderer.invoke('getBuy', dtoResult);
  },
  onBuyResponse: (callback) => ipcRenderer.on('buy-response', callback)
});
