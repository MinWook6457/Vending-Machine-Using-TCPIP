const net = require('node:net');

const SERVER_IP = 'localhost';
const SERVER_PORT1 = 3001;

let vendingInfo = null;
let coinInfo = null;

let oneThousandCount = 0;

console.log('클라이언트 실행');

const socket = net.createConnection({
    host: SERVER_IP,
    port: SERVER_PORT1
}, () => {
    console.log('서버에 연결되었습니다.');
});

socket.on('data', (data) => {
    console.log('received data from server:', data.toString());
    const dataString = data.toString();

    const [vendingDataString, coinDataString] = dataString.split('|');  // 구분자를 사용하여 분리

    try {
      if (vendingDataString) {
        vendingInfo = JSON.parse(vendingDataString);
        console.log('Vending Info:', vendingInfo);
       } else {
        console.warn('Vending data is undefined');
       }

        if (coinDataString) {
         coinInfo = JSON.parse(coinDataString);
         console.log('Coin Info:', coinInfo);
      } else {
        console.warn('Coin data is undefined');
      }
    } catch (error) {
        console.error('JSON 파싱 에러:', error);
    }
    
});

socket.on('close', () => {
    console.log('서버와의 연결이 종료되었습니다.');
});

socket.on('error', (err) => {
    console.error('에러 발생:', err);
});

socket.on('connect', () => {
    console.log('connect test');
    socket.write('data');
});

function getVendingInfo() {
    return vendingInfo;
}

function buyDrink(beverage, stock, price, inputCoin) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({ beverage, stock, price, inputCoin });
        console.log(payload)
        console.log('서버에 구매 데이터 전달');
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

function inputCoin(value,name){
  return new Promise((resolve,reject) => {
      const payload = JSON.stringify({value,name});

      console.log(`선택된 화폐 정보` + payload);

      socket.write(`input${payload}`);

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
  })
}

function getCoinInfo() {
    return coinInfo;
}

function getChange(inputCoin){
    return new Promise((resolve,reject) => {
        const payload = JSON.stringify({inputCoin});
  
        console.log(`잔돈 금액` + payload);
  
        socket.write(`change${payload}`);
  
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
    })
}

function checkPassword(password){
    return new Promise((resolve,reject) => {
        const payload = JSON.stringify({password});
  
        console.log(`입력된 비밀번호` + password);
  
        socket.write(`password${payload}`);
  
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
    })
}

module.exports = {
    socket, getVendingInfo, buyDrink, getCoinInfo, inputCoin, getChange, checkPassword
};
