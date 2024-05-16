// preload.js
const { v4: uuidv4 } = require('uuid');
const { ipcRenderer } = require('electron');

const mainDTO = async (command, data) => {
  const hash = uuidv4();
  try {
    const clientData = {
      hash: hash,
      command,
      vendingId: "",
      clientData: data
    }

    return clientData;
  } catch (err) {
    console.log('DTO ERROR:', err);
    throw err;
  }
};

(async () => {
  try {
    const stock = 10; // Example stock value
    const dtoResult = await mainDTO('stock', { stock });
    const response = await ipcRenderer.invoke('stock', dtoResult);
    console.log(response);
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
