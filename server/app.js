require('dotenv').config()

const net = require('net')
const PORT = 3001

const { sequelize } = require('./models/index')

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });


var server = require('net').createServer(function(socket){
	console.log('new Connection')

	socket.setEncoding('utf8')
	socket.write("Type 'quit' to exit\n")

	socket.on('data',function(data){
		console.log('got' , data.toString())

		if(data.trim().toLowerCase()==='quit'){
			socket.write('Byte')
			return socket.end()
		}

		socket.write(data)
	})
})

server.on('listening',function(){
	console.log(`Server listening on port ${PORT}`);
})

server.on('close',function(){
	console.log('Server is now closed')
})

server.on('error',function(){
	console.log('Error occured',err.message)
})

server.listen(PORT)