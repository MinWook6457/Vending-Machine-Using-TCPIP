const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { socket1, getInfo, buyDrink , getCoinInfo, inputCoin, getChange, filledCoin,
  checkPassword, refresh, makeUpVending, makeUpCoin, record, collect, changeAdminPassword,
  beverageNameChange, beveragePriceChange
  } = require('./client');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let windows = [];


/*
* createWindow() : 브라우저 창 생성
*/
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // 미리 로드할 스크립트 경로 설정
      nodeIntegrationInWorker: true, // 워커 스레드 NODE 통합
      contextIsolation: true, // 컨텍스트 격리
      enableRemoteModule: false, // 원격 비활성화
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // 메인 윈도우 로드 URL 설정
  mainWindow.webContents.openDevTools(); // F12 (개발자 도구) OPEN

  windows.push(mainWindow); // 창 배열에 생성된 창 추가 => 브로드 캐스팅을 위함
};

app.whenReady().then(() => {
  createWindow(); // 1번 창
  createWindow(); // 2번 창

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


  /*
  * reload : 브로드 캐스팅 시 모든 창에 변경 사항을 저장하기 위한 window reload
  */
  ipcMain.on('reloadAllWindows', () => {
    BrowserWindow.getAllWindows().forEach(window => {
      window.reload();
    });
  });

  /*
  * getInfo : 자판기 정보 불러오기
  * 음료 이름, 음료 가격, 음료 재고 => findAll({}) 
  * return : {
  { beverage: 'water', price: 450, stock: 7 },
  { beverage: 'coffee', price: 500, stock: 7 },
  { beverage: 'sports', price: 550, stock: 10 },
  { beverage: 'shake', price: 700, stock: 10 },
  { beverage: 'cola', price: 750, stock: 8 },
  { beverage: 'ade', price: 800, stock: 10 }} 
  */
  ipcMain.handle('getInfo', async () => {
    const vendingInfo = await getInfo();
    // broadcast('getInfo', vendingInfo);
    return vendingInfo;
  });

  /*
  * getCoin : 화폐 정보 불러오기
  * 화폐 단위, 화폐 가격, 화폐 재고 => findAll({}) 
  * return : {
  { unit: '10won', price: 10, change: 10 },
  { unit: '50won', price: 50, change: 10 },
  { unit: '100won', price: 100, change: 10 },
  { unit: '500won', price: 500, change: 10 },
  { unit: '1000won', price: 1000, change: 10 },
  }
  */
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

  /*
  * getBuy : 음료 구매 ipcMain 핸들러
  * input : 음료 이름, 음료 가격, 음료 재고, 투입된 화폐 금액
  * output : 구매 후 해당 음료 재고, 구매 후 계산된 화폐 금액
  * return : {
    success: true,
    message: '구매 완료',
    beverage: 'coffee',
    remainingStock: 6,
    price: 500,
    remainingCoin: 850
   }
  */
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


  /*
  * getCoin : 화폐 투입 ipcMain 핸들러
  * input : 화폐 가치(price) , 화폐 이름(unit)
  * output : coinValue, coinName
  return : {
  success: true, 
  message: '코인 입력 완료', 
  name, remainingChange: newChange
  }
  */
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

 
  /*
  * getChange : 잔돈 반환 ipcMain 핸들러
  * input : inputCoin(선택한 화폐)
  * output : array of change
  return : {
  success: true,
  message: '잔돈 반환 완료',
  change: { '10': 0, '50': 1, '100': 4, '500': 1, '1000': 0 }
  }
  */
  ipcMain.handle('getChange',async(event,payload) => {
    const change = payload.inputCoin;
    try{
      const response = await getChange(change);
      return response
    }catch(error){
      return { success : false, message : error.message}
    }
  })


  /*
  * checkPassword : 관리자 비밀번호 확인 ipcMain 핸들러
  * input : password(관리자 비밀번호)
  * output : success
  return : {
  "success":true,
  "message":"비밀번호가 맞습니다.",
  "password":"@admin1234"
  }
  */
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

  /*
  * changePassword : 관리자 비밀번호 변경 ipcMain 핸들러
  * input : password(현재 비밀번호) , changePassword(변경할 비밀번호)
  * output : success
  return : {
 "success":true,"message":"비밀번호가 성공적으로 변경되었습니다."
  }*/
  ipcMain.handle('changePassword',async(event,payload) => {
    const { currentPassword, changePassword } = payload;

    try{
        const response = await changeAdminPassword(currentPassword,changePassword);
        return response;
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * beverageNameChange : 음료 이름 변경 ipcMain 핸들러
  * input : 변경할 음료 이름, 새로운 음료 이름
  * output : success
  return : {
  "success":true,"message":"음료 이름 변경 완료"
  "exception" : {
    - 음료에 대한 이미지가 Vending DB에 존재하는 이름과 Drink 컴포넌트를 통해
      정적으로 매핑되고 있기 때문에 현존하는 자판기의 음료들 속에서만 이름이 변경 가능함
  }
  }*/
  ipcMain.handle('beverageNameChange',async(event,payload) => {
    const {beverageName , newBeverageName} = payload
    try{
      const response = await beverageNameChange(beverageName,newBeverageName);
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * beveragePriceChange : 음료 가격 변경 ipcMain 핸들러
  * input : 변경할 음료 이름, 변경할 음료 가격, 새로운 음료 가격
  * output : success
  return : {
  "success":true,"message":"음료 가격 변경 완료"
   "exception" : {
    - 중복된 음료에 대해서 동일하게 음료 가격이 업데이트 되는 현상 발생
  }
  }*/
  ipcMain.handle('beveragePriceChange',async(event,payload) => {
    const {beverageName, beveragePrice , newBeveragePrice} = payload
    try{
      const response = await beveragePriceChange(beverageName, beveragePrice , newBeveragePrice);
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * refresh : 재고 보충 ipcMain 핸들러
  * input : ---
  * output : 재고 보충 후 자판기 데이터
  return : {
  success: true,
  message: '재고 보충 완료',
  data: [
    { beverage: 'water', price: 450, stock: 10 },
    { beverage: 'coffee', price: 500, stock: 10 },
    { beverage: 'sports', price: 550, stock: 10 },
    { beverage: 'shake', price: 700, stock: 10 },
    { beverage: 'cola', price: 750, stock: 10 },
    { beverage: 'ade', price: 800, stock: 10 }
  ]
  }*/
  ipcMain.handle('refresh',async(event,payload) => {
    try{
      const response = await refresh();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * makeUpVending : 현재 자판기 음료별 판매 통계 계산을 위한 자판기 데이터
  * input : ---
  * output : --- 
  return : {
  success: true, message: '전체 자판기 데이터 전달', refreshData
  }*/
  ipcMain.handle('makeUpVending', async(event,payload) => {
    try{
      const response = await makeUpVending();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * makeUpCoin : 현재 자판기 화폐 현황 파악을 위한 화폐 데이터
  * input : ---
  * output : --- 
  return : {
  success: true, message: '전체 자판기 화폐 전달', refreshCoin
  }*/
  ipcMain.handle('makeUpCoin',async(event,payload) => {
    try{
      const response = await makeUpCoin();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })


  /*
  * record : 구매 기록 저장
  * input : 현재 날짜 (ex : 2024-06-09)
  * output : --- 
  return : {
  | id | beverage | price | createdAt           | updatedAt           | deletedAt |
  +----+----------+-------+---------------------+---------------------+-----------+
  |  1 | coffee   |   500 | 2024-06-08 13:08:49 | 2024-06-08 13:08:49 | NULL      |
  }
  */
  ipcMain.handle('record',async(event,payload) => {
    try{
      const date = payload.date;
      console.log(date);
      const response = await record(date);
      return response;
    }catch(error){
      return {success : false, message : error.message};
    }
  })

  /*
  * collect : 현재 까지의 자판기 판매 총액
  * input : ---
  * output : totalCollected 
  return : {
  +----+-------+---------------------+---------------------+-----------+
  | id | price | createdAt           | updatedAt           | deletedAt |
  +----+-------+---------------------+---------------------+-----------+
  |  1 | 12180 | 2024-06-08 15:14:55 | 2024-06-08 15:14:55 | NULL      |
  }
  */
  ipcMain.handle('collect',async(event,payload) => {
    try{
      const response = await collect();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * filledCoin : 화폐 보충 (거스름 돈 부족 시 모두 2개 씩)
  * input : ---
  * output : --- 
  return : {
  {"success":true,"message":"잔돈 채우기 성공"}
  }
  */
  ipcMain.handle('filledCoin',async(event,payload) => {
    try{
      const response = await filledCoin();
      return response; 
    }catch(error){
      return { success : false, message : error.message}
    }
  })

  /*
  * reloadAllWindows : 모든 윈도우 새로고침 
  * input : ---
  * output : --- 
  return : ---
  */ 
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
