var net = require('net'); 
// var tls = require('tls'); 

class TCPSocketClient {
    constructor({port, host, timeout}){
        this.socket = this.create({port, host, timeout});
    }

    create({type, port, host, timeout}) {
        this.timeout = timeout;

        const _this = this;
        // const client = (this.type === "tls") ? tls.connect({port, host}) : net.connect({port, host});
        const client = net.connect({port, host});

        client.on('connect', () => {
            // console.log("Client connected.....................");
            // console.log("Client Socket connected........ : " + " localport : " + client.localPort);
            this.socket = client;
            this.isConnected = true;

            // client.setTimeout(this.timeout || 60000); // timeout : 60초
            _this.handleConnection(client);
        })
    
        // 접속 종료 시 처리
        // Emitted once the socket is fully closed. The argument hadError is a boolean which says if the socket was closed due to a transmission error.
        // 소켓이 완전히 닫히면 발생합니다. hadError 인수는 전송 오류로 인해 소켓이 닫혔는지 여부를 나타내는 부울입니다.
        client.on('close', function() {
            this.isConnected = false;
            // console.log("Client Socket Closed........");
            //console.log("client Socket Closed........ : " + " localport : " + this.socket.localPort);
            _this.handleClose();
        });
    
        // 데이터 수신 후 처리
        // Emitted when data is received. The argument data will be a Buffer or String. Encoding of data is set by socket.setEncoding().
        // The data will be lost if there is no listener when a Socket emits a 'data' event.
        // 데이터가 수신 될 때 발생합니다. 인수 데이터는 버퍼 또는 문자열입니다. 데이터 인코딩은 socket.setEncoding ()에 의해 설정됩니다.
        // 소켓이 'data'이벤트를 생성 할 때 리스너가 없으면 데이터가 손실됩니다.
        client.on('data', (data) => {
            _this.handleData(data);
        });
        
        // Emitted when an error occurs. The 'close' event will be called directly following this event.
        // 오류가 발생하면 발생합니다. 'close'이벤트는이 이벤트 바로 다음에 호출됩니다.
        client.on('error', function(err) {
            console.log('Client Socket Error: '+ JSON.stringify(err));
        });
    
        // Emitted when the other end of the socket sends a FIN packet, thus ending the readable side of the socket.
        // By default (allowHalfOpen is false) the socket will send a FIN packet back and destroy its file descriptor once it has written out its pending write queue. However, if allowHalfOpen is set to true, the socket will not automatically end() its writable side, allowing the user to write arbitrary amounts of data. The user must call end() explicitly to close the connection (i.e. sending a FIN packet back).
        // 소켓의 다른 쪽 끝이 FIN 패킷을 보낼 때 발생하여 소켓의 읽을 수있는 쪽을 끝냅니다.
        // 기본적으로 (HalfOpen은 false 임) 소켓은 FIN 패킷을 다시 보내고 보류중인 쓰기 큐를 작성한 후 파일 디스크립터를 파기합니다. 그러나 allowHalfOpen을 true로 설정하면 소켓이 쓰기 가능한면을 자동으로 종료하지 않으므로 사용자가 임의의 양의 데이터를 쓸 수 있습니다. 연결을 닫으려면 (즉, FIN 패킷을 다시 보내려면) end ()를 명시 적으로 호출해야합니다.
        client.on('end', function() {
            // console.log('Client Socket End');
        });

        // Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.
        // 소켓이 비 활동으로 시간 종료되면 발생합니다. 이것은 소켓이 유휴 상태임을 알리기 위한 것입니다. 사용자는 연결을 수동으로 닫아야 합니다.
        client.on('timeout', function() {
            console.log('Client Socket timeout: ');
        });
        
        // Emitted when the write buffer becomes empty. Can be used to throttle uploads.
        // 쓰기 버퍼가 비게되면 발생합니다. 업로드를 조절하는 데 사용할 수 있습니다.
        client.on('drain', function() {
            // console.log('Client Socket drain: ');
        });
        
        // Emitted after resolving the host name but before connecting. Not applicable to Unix sockets.
        // 호스트 이름을 확인한 후 연결하기 전에 발생합니다. 유닉스 소켓에는 적용되지 않습니다.
        client.on('lookup', function() { 
            // console.log('Client Socket lookup: ');
        });

        return client;
    }

    handleConnection(socket) {
        // console.log("Warning, redefinition of this method is required.");
        throw new Error("You have to implement the method do Something!");
    }
    
    handleData(data) { 
        // console.log("Warning, redefinition of this method is required.");
        throw new Error("You have to implement the method do Something!");
    };
    
    handleClose() { 
        // console.log("Warning, redefinition of this method is required.");
        throw new Error("You have to implement the method do Something!");
    };

    write(data) {
        if(!this.isConnected) {
            console.log("Server Send Fail");
            return;
        }
        var success = !this.socket.write(data);
        if (!success){
            console.log("Server Send Fail");
        }
    }

    close() {
        this.socket.end();
    }

    on(type, callback) {
        this.socket.on(type, callback);
    }
}

export default TCPSocketClient;