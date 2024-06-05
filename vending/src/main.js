const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { socket1, getVendingInfo, buyDrink , getCoinInfo, inputCoin} = require('./client');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


  ipcMain.handle('refresh', async (event, payload) => {
    const { beverage } = payload;
    console.log(`Received beverage: ${beverage}`);

    const refreshData = getVendingInfo();
   // broadcast('refresh', refreshJsonData);
    return refreshData;
  });

  ipcMain.handle('getInfo', async () => {
    const vendingInfo = getVendingInfo();
    // broadcast('getInfo', vendingInfo);
    return vendingInfo;
  });

  ipcMain.handle('getCoinInfo',async(event,payload) => {
    const coinInfo = getCoinInfo();
    return coinInfo;
  })

  ipcMain.handle('getStock', async (event, payload) => {
    try {
      const stockResult = await retrieveStockData(payload);
      console.log('Retrieving stock data:', stockResult);
      return stockResult;
    } catch (error) {
      console.error('Error while retrieving stock data:', error);
      throw error;
    }
  });

  ipcMain.handle('getBuy', async (event, payload) => {
    const { beverage, stock } = payload;
    console.log(beverage, stock);
    try {
      const response = await buyDrink(beverage, stock);
      return response;
    } catch (error) {
      console.error('Error in getBuy handler:', error);
      return { success: false, message: error.message };
    }
  });


  ipcMain.handle('getCoin',async(event,payload)=>{
    const coinValue = payload.value;
    const coinName = payload.name;
    try{
      const response = await inputCoin(coinValue, coinName);
      return response;
    }catch(error){
      return { success: false, message: error.message };
    }
  })


});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
