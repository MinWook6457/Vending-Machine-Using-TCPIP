// import events from "events";

var net = require('net');
// var tls = require('tls');

// class TCPSocketServer extends events.EventEmitter {
class TCPSocketServer {
    constructor({type, port, host, timeout}) {
        // super();

        this.type = type;
        this.port = port;
        this.host = host;
        this.timeout = timeout;
        this.server = this.create();
    }

    create() {
        const _this = this;
        // const server = (this.type === "tls") ? tls.createServer((client) => { }) : net.createServer((client) => { });
        const server = net.createServer((client) => { });

        server.listen(this.port, this.host, () => {
            // console.log('Server listening: ' + JSON.stringify(server.address()));
            // Emitted when the server has been bound after calling server.listen().
            // server.listen ()을 호출 한 후 서버가 바인드 될 때 발생합니다.
            server.on('listening', (socket) => {
                console.log('Server listening');
            });

            // Emitted when a new connection is made. socket is an instance of net.Socket.
            // 새로 연결했을 때 발생합니다. socket은 net.Socket의 인스턴스입니다.
            server.on('connection', (socket) => {
                // console.log('Client connection: ');
                // console.log('   local = %s:%s', client.localAddress, client.localPort);
                // console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);
                
                // socket.setTimeout(this.timeout || 60000);
                // socket.setEncoding('utf8');
                
                socket.on('data', (data) => {
                    _this.handleData(socket, data);
                    // this.writeData(socket, 'Sending: ' + data.toString());
                    // console.log('  Bytes sent: ' + socket.bytesWritten);
                });
                
                // Emitted when the other end of the socket sends a FIN packet, thus ending the readable side of the socket.
                // By default (allowHalfOpen is false) the socket will send a FIN packet back and destroy its file descriptor once it has written out its pending write queue. However, if allowHalfOpen is set to true, the socket will not automatically end() its writable side, allowing the user to write arbitrary amounts of data. The user must call end() explicitly to close the connection (i.e. sending a FIN packet back).
                // 소켓의 다른 쪽 끝이 FIN 패킷을 보낼 때 발생하여 소켓의 읽을 수있는 쪽을 끝냅니다.
                // 기본적으로 (HalfOpen은 false 임) 소켓은 FIN 패킷을 다시 보내고 보류중인 쓰기 큐를 작성한 후 파일 디스크립터를 파기합니다. 그러나 allowHalfOpen을 true로 설정하면 소켓이 쓰기 가능한면을 자동으로 종료하지 않으므로 사용자가 임의의 양의 데이터를 쓸 수 있습니다. 연결을 닫으려면 (즉, FIN 패킷을 다시 보내려면) end ()를 명시 적으로 호출해야합니다.
                socket.on('end', () => {
                    // console.log('socket disconnected');
                    _this.handleClose(socket);
                });
                
                // Emitted when an error occurs. The 'close' event will be called directly following this event.
                // 오류가 발생하면 발생합니다. 'close'이벤트는이 이벤트 바로 다음에 호출됩니다.
                socket.on('error', (err) => {
                    console.log('Socket Error: ', JSON.stringify(err));
                });
                
                // Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.
                // 소켓이 비 활동으로 시간 종료되면 발생합니다. 이것은 소켓이 유휴 상태임을 알리기 위한 것입니다. 사용자는 연결을 수동으로 닫아야 합니다.
                socket.on('timeout', () => {
                    console.log('Socket Timed out');
                });

                // console.log('socket connection (TCP Socket Server): ' + socket);
                this.handleConnection(socket);
            });

            // Emitted when the server closes. If connections exist, this event is not emitted until all connections are ended.
            // 서버가 닫힐 때 발생합니다. 연결이 존재하면이 이벤트는 모든 연결이 종료 될 때까지 생성되지 않습니다.
            server.on('close', () => {
                console.log('Server Terminated');
            });

            // Emitted when an error occurs. Unlike net.Socket, the 'close' event will not be emitted directly following this event unless server.close() is manually called. See the example in discussion of server.listen().
            // 오류가 발생하면 발생합니다. net.Socket과 달리 server.close ()를 수동으로 호출하지 않으면 'close'이벤트가이 이벤트 바로 뒤에 생성되지 않습니다. server.listen ()에 대한 논의에서 예제를 참조하십시오.
            server.on('error', (err) => {
                console.log('Server Error: ', JSON.stringify(err));
                if (err.code == 'EADDRINUSE') {
                    console.log('Address in use, retrying...');
                    setTimeout(function () {
                        server.close();
                        server.listen(this.port, this.host);
                    }, 1000);
                }
            });
        });

        return server;
    }

    handleConnection(socket) {
        // console.log("Warning, redefinition of this method is required.");
        throw new Error("You have to implement the method do Something!");
    }

    handleClose() {
        // console.log("Warning, redefinition of this method is required.");
        throw new Error("You have to implement the method do Something!");
    }

    write(socket, data) {
        var success = socket.write(data);
        if (!success){
            console.log("Client Send Fail");
        }
    }
    
    handleData(socket, data) { 
        // console.log("Warning, redefinition of this method is required.");
        throw new Error("You have to implement the method do Something!");
    };

    shutdown() {
        this.server.close(() => {
        });
    }
}

// export default TCPSocketServer;
module.exports = TCPSocketServer;