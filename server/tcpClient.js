const net = require('net');

function connectToServer(host, port, onDataReceived) {
    const client = new net.Socket();
    
    client.connect(port, host, function() {
        console.log('Connected to server');
    });

    client.on('data', function(data) {
        onDataReceived(data.toString());
    });

    client.on('close', function() {
        console.log('Connection closed');
    });

    return client;
}

export default connectToServer;