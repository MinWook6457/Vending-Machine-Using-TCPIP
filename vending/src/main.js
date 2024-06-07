const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { socket1, getInfo, buyDrink , getCoinInfo, inputCoin, getChange, checkPassword, refresh, makeUp} = require('./client');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let windows = [];

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

  windows.push(mainWindow);
};

app.whenReady().then(() => {
  createWindow();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


  // ipcMain.handle('refresh', async (event, payload) => {
  //   const { beverage } = payload;
  //   console.log(`Received beverage: ${beverage}`);

  //   const refreshData = getVendingInfo();
  //  // broadcast('refresh', refreshJsonData);
  //   return refreshData;
  // });

  ipcMain.on('reloadAllWindows', () => {
    BrowserWindow.getAllWindows().forEach(window => {
      window.reload();
    });
  });

  ipcMain.handle('getInfo', async () => {
    const vendingInfo = await getInfo();
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


  ipcMain.handle('getCoin',async(event,payload)=>{
    const coinValue = payload.value;
    const coinName = payload.name;
    try{
      const response = await inputCoin(coinValue, coinName);

      console.log(response)

      return response;
    }catch(error){
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('getChange',async(event,payload) => {
    const change = payload.inputCoin;
    try{
      const response = await getChange(change);
      return response
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  ipcMain.handle('checkPassword',async(event,payload) => {
    const password = payload.password;
    console.log(password)
    try{
      const response = await checkPassword(password);
      return response
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  ipcMain.handle('refresh',async(event,payload) => {
    try{
      const response = await refresh();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  ipcMain.handle('makeUp', async(event,payload) => {
    try{
      const response = await makeUp();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  ipcMain.on('reloadAllWindows', () => {
    BrowserWindow.getAllWindows().forEach(window => {
      window.reload();
    });
  });


  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
