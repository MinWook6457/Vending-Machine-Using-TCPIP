require('dotenv').config()

const net = require('net')
const PORT = 3000
const { sequelize } = require('./models/index')

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });


// 서버 생성
const server = net.createServer((socket) => {
	console.log('Client connected');
  
	// 클라이언트로부터 음료 정보 수신
	socket.on('data', async (data) => {
	  const drinkData = JSON.parse(data);
	  console.log('Received drink data:', drinkData);
  
	  // 음료 데이터를 데이터베이스에 저장
	  try {
		await sequelize.sync();
		const drink = await Drink.create(drinkData);
		console.log('Drink created:', drink.toJSON());
	  } catch (error) {
		console.error('Error creating drink:', error);
	  }
	});
  });
  
  server.on('error', (err) => {
	console.error('Server error:', err);
  });
  
  server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
  });