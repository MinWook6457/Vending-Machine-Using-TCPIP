require('dotenv').config();
const net = require('net');
const PORT = 3001;
const { Vending, sequelize } = require('./models/index'); // Ensure you have the correct path

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });




const server = net.createServer((socket) => {
  console.log('클라이언트가 연결되었습니다.');
  socket.setEncoding('utf8')

  Vending.findAll({
    attributes : [
      'beverage' , 'price' , 'stock', 'imageURL'
    ]
  }).then((data) => {
    const vendingData = JSON.stringify(data);
    // console.log(vendingData)
    socket.write(vendingData);
  }).catch((error)=>{
    console.log('데이터베이스 쿼리 에러 : ' , error)
  })


  socket.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });

  socket.on('error', (err) => {
    console.error('에러 발생:', err);
  });
});

server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 대기 중입니다.`);
});