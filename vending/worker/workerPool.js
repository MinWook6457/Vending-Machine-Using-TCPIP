const net = require('net')

const client = new net.Socket()
const testPort = 8080

console.log(`worker connected Host : ${testPort} `)

function connectToHost(){
    try {
        client.connect(testPort)
    } catch(e){
        console.log('연결 실패')
    }
}

client.on("connect", ()=> {
    connectToHost()
    console.log("tcp connected")
})