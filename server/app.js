require('dotenv').config();
const net = require('net');
const { Vending, sequelize } = require('./models/index'); // Ensure you have the correct path

const clients = []; // 클라이언트 배열

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err);
  });

// 서버 1 설정 (포트: 3001)
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

  Vending.findAll({
    attributes: ['beverage', 'price', 'stock', 'imageURL']
  }).then((data) => {
    const vendingData = JSON.stringify(data);
    socket.write(vendingData);
  }).catch((error) => {
    console.log('데이터베이스 쿼리 에러:', error);
  });

  socket.on('data', (data) => {
    console.log('클라이언트로부터 받은 데이터:', data.toString());


    

    if (data.startsWith('buy')) {
      const payload = data.substring(3); 
      try {
        const { beverage, stock } = JSON.parse(payload);
        console.log(`구매 요청 - 음료수: ${beverage}, 재고: ${stock}`);

        Vending.findOne({
          where: { beverage },
          attributes: ['beverage', 'stock']
        }).then((item) => {
          if (item) {
            if (item.stock >= 0) {
              item.stock -= 1;
              Vending.update(
                { stock: item.stock },
                { where: { beverage } }
              ).then(() => {
                socket.write(JSON.stringify({ success: true, message: '구매 완료', beverage, remainingStock: item.stock }));
              }).catch((updateError) => {
                console.error('재고 업데이트 실패:', updateError);
                socket.write(JSON.stringify({ success: false, message: '재고 업데이트 실패' }));
              });
            } else {
              socket.write(JSON.stringify({ success: false, message: '재고 부족' }));
            }
          } else {
            socket.write(JSON.stringify({ success: false, message: '음료를 찾을 수 없음' }));
          }
        }).catch((findError) => {
          console.error('음료 검색 실패:', findError);
          socket.write(JSON.stringify({ success: false, message: '음료 검색 실패' }));
        });

      } catch (error) {
        console.error('구매 데이터 파싱 에러:', error);
        socket.write(JSON.stringify({ success: false, message: '구매 실패' }));
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
  console.log(`서버 1가 ${PORT1} 포트에서 대기 중입니다.`);
});
