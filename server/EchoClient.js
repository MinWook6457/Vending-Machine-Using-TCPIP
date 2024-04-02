const TCPSocketClient = require('./TCPSocketClient')

class EchoClient extends TCPSocketClient {
    constructor({port, host, timeout}) {
        super({port, host, timeout});
    }
    
    handleConnection(socket) {
        console.log("connect log======================================================================"); 
        console.log('connect success'); 
        console.log('local = ' + socket.localAddress + ':' + socket.localPort); 
        console.log('remote = ' + socket.remoteAddress + ':' + socket.remotePort); 

        socket.setEncoding('utf8'); 
        socket.setTimeout(this.timeout || 10000); // timeout : 10분 
        console.log("Client setting Encoding:binary, timeout:" + (this.timeout || 10000));
        console.log("Client connect localport : " + socket.localPort);
    };
    
    handleData(data) { 
        console.log("data recv log======================================================================"); 
        console.log("data : " + data);
        console.log("data.length : " + data.length);
        console.log("data recv : " + data);
    };

    handleClose() {
    }
}

var client1 = new EchoClient({port: 9010, host:'192.168.0.100'});
client1.on("connect", () => {
    client1.write("Echo Message1 in Client1....");
    setTimeout(() => {
        client1.write("Echo Message2 in Client1....");
    }, 1500);
    setTimeout(() => {
        client1.close();
        console.log("-------------");
    }, 3000);
});


var client2 = new EchoClient({port: 9010, host:'localhost'});
client2.on("connect", () => {
    client2.write("Echo Message1 in Client2....");
    setTimeout(() => {
        client2.write("Echo Message2 in Client2....");
    }, 2000);
    setTimeout(() => {
        client2.close();
        console.log("-------------");
    }, 5000);
});