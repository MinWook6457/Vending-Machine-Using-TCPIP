require('dotenv').config();
const net = require('net');
const { Vending, Coin, sequelize } = require('./models/index');

const clients = [];

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err);
  });

const PORT1 = 3001;
const server1 = net.createServer((socket) => {
  console.log('클라이언트가 연결되었습니다.');
  socket.setEncoding('utf8');

  if (clients.length >= 2) {
    console.log('최대 클라이언트 수를 초과하여 연결을 거부합니다.');
    socket.destroy();
    return;
  }

  clients.push(socket);

  sendVendingData(socket);
  sendCoinData(socket);

  socket.on('data', async (data) => {
    console.log('클라이언트로부터 받은 데이터:', data.toString());

    if (data.startsWith('buy')) {
      const payload = data.substring(3);
      try {
        const { beverage, price, inputCoin } = JSON.parse(payload);
        console.log(`구매 요청 - 음료수: ${beverage}, 가격 :${price}, 투입된 화폐 : ${inputCoin}`);

        const item = await Vending.findOne({
          where: { beverage },
          attributes: ['beverage', 'price', 'stock']
        });

        if (item) {
          if (item.stock > 0) {
            const newStock = item.stock - 1;
            await Vending.update({ stock: newStock }, { where: { beverage } });
            const remainingCoin = inputCoin - price;
            socket.write(JSON.stringify({ success: true, message: '구매 완료', beverage, remainingStock: newStock, price, remainingCoin }));
          } else {
            socket.write(JSON.stringify({ success: false, message: '재고 부족' }));
          }
        } else {
          socket.write(JSON.stringify({ success: false, message: '음료를 찾을 수 없음' }));
        }
      } catch (error) {
        console.error('구매 데이터 처리 에러:', error);
        socket.write(JSON.stringify({ success: false, message: '구매 실패' }));
      }
    }

    if (data.startsWith('input')) {
      const payload = data.substring(5);
      try {
        const { value, name } = JSON.parse(payload);
        console.log(`코인 입력 요청 - 코인 값: ${value}, 코인 이름: ${name}`);

        const coin = await Coin.findOne({
          where: { price: value },
          attributes: ['unit', 'price', 'change']
        });

        if (coin) {
          const newChange = coin.change + 1;
          await Coin.update({ change: newChange }, { where: { price: value } });
          socket.write(JSON.stringify({ success: true, message: '코인 입력 완료', name, remainingChange: newChange }));
        } else {
          socket.write(JSON.stringify({ success: false, message: '코인을 찾을 수 없음' }));
        }
      } catch (error) {
        console.error('코인 데이터 처리 에러:', error);
        socket.write(JSON.stringify({ success: false, message: '코인 입력 실패' }));
      }
    }

    if (data.startsWith('change')) {
      const payload = data.substring(6);
      try {
        const { inputCoin } = JSON.parse(payload);
        console.log(`잔돈 반환 요청 - 투입된 금액 : ${inputCoin}`);

        const change = await calculateChange(inputCoin);
        await updateCoinChange(change);
        socket.write(JSON.stringify({ success: true, message: '잔돈 반환 완료', change }));
      } catch (error) {
        console.error('잔돈 데이터 처리 에러:', error);
        socket.write(JSON.stringify({ success: false, message: '잔돈 반환 실패' }));
      }
    }

    if(data.startsWith('password')){
      const payload = data.substring(8);
      try{
        const {password} = JSON.parse(payload);

        console.log(typeof password)

        if(password === "admin1234"){
          socket.write(JSON.stringify({ success: true, message: '비밀번호가 맞습니다.', password }));
        }else{
          socket.write(JSON.stringify({ success: false, message: '비밀번호가 맞지 않습니다.' }));
        }
      }catch(error){
        socket.write(JSON.stringify({ success: false, message: '관리자 모드 에러' }));
      }
    }

  });

  socket.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  socket.on('error', (err) => {
    console.error('에러 발생:', err);
  });
});

server1.listen(PORT1, () => {
  console.log(`서버가 ${PORT1} 포트에서 대기 중입니다.`);
});

function sendVendingData(socket) {
  Vending.findAll({
    attributes: ['beverage', 'price', 'stock']
  })
    .then((data) => {
      const vendingData = JSON.stringify(data);
      socket.write(vendingData + '|');
    })
    .catch((error) => {
      console.log('데이터베이스 쿼리 에러:', error);
    });
}

function sendCoinData(socket) {
  Coin.findAll({
    attributes: ['unit', 'price', 'change']
  })
    .then((data) => {
      const coinData = JSON.stringify(data);
      socket.write(coinData);
    })
    .catch((error) => {
      console.log('데이터베이스 쿼리 에러:', error);
    });
}

async function calculateChange(inputCoin) {
  const tempCoins = [1000, 500, 100, 50, 10];
  let remainChange = inputCoin;
  const changes = {};

  for (const coinValue of tempCoins) {
    const count = Math.floor(remainChange / coinValue);
    if (count > 0) {
      changes[coinValue] = count;
      remainChange -= coinValue * count;
    } else {
      changes[coinValue] = 0;
    }
  }

  return changes;
}

async function updateCoinChange(change) {
  for (const [unit, count] of Object.entries(change)) {
    try {
      const coin = await Coin.findOne({ where: { price: parseInt(unit) }, attributes: ['price', 'change'] });
      if (coin) {
        const newChange = coin.change - count;
        if(newChange === 0){
          socket.write(JSON.stringify({ success: false, message: '잔돈 반환 실패, 잔돈이 부족합니다.' }));
        }     
        await Coin.update({ change: newChange }, { where: { price: parseInt(unit) } });
        console.log(`${unit} 코인 업데이트 성공`);
      }
    } catch (error) {
      console.error(`${unit} 코인 업데이트 실패:`, error);
    }
  }
}
