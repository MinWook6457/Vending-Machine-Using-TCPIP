const net = require('net');
const socket = net.connect({
	port: 2031,
	host: "localhost"
});

// setting encoding
socket.setEncoding('utf8');

socket.on('connect', function () {
	console.log('on connect');

	// send message to server
	setTimeout(() => {
		socket.write('msg from client');
	}, 1000);

	setTimeout(() => {
		// socket.destroy();
	}, 2000);
});

socket.on('data', function (data) {
	console.log(data);
});

socket.on('close', function () {
	console.log('close');
});

socket.on('error', function (err) {
	console.log('on error: ', err.code);
});