const { app, BrowserWindow, ipcMain} = require('electron');

const path = require('path');

const {socket,getVendingInfo} = require('./client');
const { get } = require('http');

if (require('electron-squirrel-startup')) {
  app.quit();
}

async function retrieveStockData(data) {
  return data;
}

async function resultBuyData(data) {
  const vendingInfo = await getVendingInfo();

  const item = vendingInfo.items.find(item => item.id === data.itemId);
  if(item && item.stock > 0){
    item.stock -= 1;
    return {success : true, item};
  }else{
    return {success : false, message : 'Item out of stock or not found'};
  }
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegrationInWorker: true, // 해당 설정을 통해 프론트에서 node 기능 사용
      contextIsolation : true,
      enableRemoteModule : false,
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

  ipcMain.handle('getInfo',async(event,payload) => {
      const vendingInfo = getVendingInfo()
      return vendingInfo
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

  ipcMain.handle('getBuy',async(event,payload) => {
    if (stock.hasOwnProperty(beverage)) {
      if (stock[beverage].stock > 0) {
        stock[beverage].stock -= 1;
        return { success: true, beverage, remainingStock: stock[beverage].stock };
      } else {
        return { success: false, message: 'Out of stock' };
      }
    } else {
      return { success: false, message: 'Unknown beverage' };
    }
})

  // ipcMain.on('buyButtonClicked',async(event,event) =>{
  //   try{
  //     const vendingInfo = getVendingInfo()
  //     console.log(vendingInfo)
  //   }catch(err){

  //   }

  // })

 
  // ipcMain.handle('getBuy', async (event, payload) => {
  //   try {
     
  //   } catch (error) {
  //     console.error('Error while processing buy result:', error);
  //     throw error;
  //   }
  // });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


