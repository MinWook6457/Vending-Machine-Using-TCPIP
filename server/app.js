require('dotenv').config();
const net = require('net');
const { Vending, Coin, Record, Collect, sequelize } = require('./models/index');
const { Op } = require('sequelize'); 
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

  // sendVendingData(socket);

  socket.on('data', async (data) => {
    console.log('클라이언트로부터 받은 데이터:', data.toString());

    if(data.startsWith('getInfo')){
      try{
        sendVendingData(socket)
      }catch(err){
        console.log('테스트 에러')
      }
    }

    if(data.startsWith('getCoin')){
      try{
         sendCoinData(socket);
      }catch(err){
        console.log('테스트 에러')
      }
    }

    

    if (data.startsWith('buy')) {
      const payload = data.substring(3);
      try {
        const { beverage, price, inputCoin } = JSON.parse(payload);
        console.log(`구매 요청 - 음료수: ${beverage}, 가격 :${price}, 투입된 화폐 : ${inputCoin}`);

        // 구매 후 RECORD
        Record.create({
          beverage : beverage ,
          price : price
        })

        const item = await Vending.findOne({
          where: { beverage },
          attributes: ['beverage', 'price', 'stock', 'money']
        });

        console.log(item.money)

        if (item) {
          if (item.stock > 0) {
            const newStock = item.stock - 1;
            await Vending.update({ stock: newStock , money : (item.money += price) }, { where: { beverage } });
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

        const calChange = await calculateChange(inputCoin);

        if (Object.values(calChange).every(value => value === 0)) {
          console.log('잔돈이 없습니다.');
          socket.write(JSON.stringify({ success: false, message: '잔돈이 없습니다.' }));
          return;
        }

        const change = await updateCoinChange(calChange,socket);

        socket.write(JSON.stringify({ success: true, message: '잔돈 반환 완료', change }));
      } catch (error) {
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

    if(data.startsWith('refresh')){
      try{
        const vendingData = await Vending.findAll({
          attributes: ['beverage', 'price', 'stock']
        })
        const refreshData = JSON.stringify(vendingData); 
        const test = JSON.parse(refreshData)
        await refreshVending(test);

        const data = await refreshVendingInfo(test);

        socket.write(JSON.stringify({ success: true, message: '재고 보충 완료', data }));
      }catch(err){
        socket.write(JSON.stringify({ success: false, message: '재고 보충 실패' }));
      }
    }

    if(data.startsWith('makeUpVending')){
      try{
        const vendingData = await Vending.findAll({
          attributes: ['beverage', 'price', 'stock','money']
        })
          
        const refreshData = JSON.stringify(vendingData);
        socket.write(JSON.stringify({ success: true, message: '전체 자판기 데이터 전달', refreshData }));

      }catch(err){
        socket.write(JSON.stringify({ success: false, message: '자판기 통계 에러' }));
      }
    }

    if(data.startsWith('makeUpCoin')){
      try{
        const coinData = await Coin.findAll({
          attributes: ['unit', 'price', 'change']
        })
          
        const refreshData = JSON.stringify(coinData);
        socket.write(JSON.stringify({ success: true, message: '전체 화폐 데이터 전달', refreshData}));

      }catch(err){
        socket.write(JSON.stringify({ success: false, message: '화폐 데이터 전달 중 에러' }));
      }
    }

    if(data.startsWith('record')){
      const date = data.substring(6).trim(); // 날짜 문자열 추출 및 공백 제거

      // const recordDate = new Date(date);

      try{
        const vendingData = await Vending.findAll({
          attributes: ['beverage']
        })

        const parseData = JSON.parse(JSON.stringify(vendingData));

        const records = {};

        const startDate = new Date(`${date}T00:00:00`);
        const endDate = new Date(`${date}T23:59:59`);

        for(const item of parseData){
          const beverage = item.beverage;
          const recordCount = await Record.count({
            where : {
              beverage : beverage,
              createdAt: {
                [Op.between]: [startDate, endDate]
              }
            }
          })
          records[beverage] = recordCount;
        }

        console.log(records)
        socket.write(JSON.stringify({ success: true, message: '기록 데이터 전달', records}));
      }catch(err){
        socket.write(JSON.stringify({ success: false, message: '기록 데이터 전달 중 에러' }));
      }
    }

    if(data.startsWith('collect')){
      try{
        const coinData = await Coin.findAll({
          attributes: ['price','change']
        })

        const parseData = JSON.parse(JSON.stringify(coinData));

        let totalCollected = 0;

        for(const item of parseData){
          const change = item.change;
          const price = item.price;

          if (change > 2) {
          const coinsToCollect = change - 2;
          totalCollected += coinsToCollect * price;

          await Coin.update(
            { change: 2 },
            { where: { price: price } }
            );
          }
        }

        Collect.create({
          price : totalCollected
        })

        console.log({ success: true, message: '총 합계 전달', totalCollected });
        socket.write(JSON.stringify({ success: true, message: '총 합계 전달', totalCollected }));
      }catch(error){
        console.error('Error collecting coins:', error);
        socket.write(JSON.stringify({ success: false, message: '코인 수집 중 에러' }));
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
      socket.write(vendingData);
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

  console.log(changes)

  return changes;
}

async function updateCoinChange(change, socket) {
  for (const [unit, count] of Object.entries(change)) {
    try {
      const coin = await Coin.findOne({ where: { price: parseInt(unit) }, attributes: ['price', 'change'] });

      if (!coin) {
        console.log(`${unit} 코인이 존재하지 않습니다.`);
        socket.write(JSON.stringify({ success: false, message: '코인을 찾을 수 없음' }));
        return;
      }

      console.log(`${coin.price}의 남은 화폐 : ${coin.change}`);

      if (coin.change < count) {
        console.log('화폐 부족');
        socket.write(JSON.stringify({ success: false, message: '잔돈 반환 실패, 화폐가 부족합니다.' }));
        return;
      }

      const newChange = coin.change - count;
      await Coin.update({ change: newChange }, { where: { price: parseInt(unit) } });
      console.log(`${unit} 코인 업데이트 성공`);
    } catch (error) {
      console.error(`${unit} 코인 업데이트 실패:`, error);
    }
  }

  return change;
}



async function refreshVending(refreshData) {
  for (const [number,data] of Object.entries(refreshData)) {
    try {
        await Vending.update({ stock: 10 }, { where: { beverage: data.beverage } });
        // console.log(`${beverage} 재고 보충 성공`);
    } catch (error) {
      console.error(`${beverage} 재고 보충 실패:`, error);
    }
  }
}

async function refreshVendingInfo(refreshData){
  for (const [number,data] of Object.entries(refreshData)){
    data.stock = 10;
  }

  return refreshData;
}
