const net = require('net');

const client = net.connect({ port: 8080, host: 'localhost' }, function () {
    console.log('client connected');
    client.write('send data!\r\n');
});

client.on('data', function (data) {
    console.log(data.toString());
    // 클라이언트에서 이벤트 발생
    process.emit('messageFromClient', data.toString());
    client.end();
});

client.on('end', function () { // end 이벤트 발생시 callback    
    console.log('Client disconnected');
});
