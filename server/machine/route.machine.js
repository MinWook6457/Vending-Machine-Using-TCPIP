const vendingMachine  = require('./controller.machine/vendingMachine');

function handleRequest(requestData, socket) {
    const request = parseRequest(requestData);
    const { method, path } = request;

    // 요청 메서드와 경로에 따라 처리
    if (method === 'POST' && path === '/machine/selectedBeverage') {
        // POST /machine/selectedBeverage 요청 처리
        // 데이터를 추출하고 유효성 검사 후 vendingMachine.selectedBeverage 호출
        const { description, price } = request.data;
        vendingMachine.selectedBeverage({ body: { description, price } }, { socket });
    } else if (method === 'POST' && path === '/machine/selectStock') {
        // POST /machine/selectStock 요청 처리
        const { stock_id } = request.data;
        vendingMachine.selectStock({ body: { stock_id } }, { socket });
    } else {
        // 잘못된 요청 처리
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.write('404 Not Found');
    }
}

function parseRequest(requestData) {
    // HTTP 요청을 파싱하는 로직 구현 (예: 요청 라인 분석, 헤더 분석, 데이터 추출 등)
    // 요청 데이터를 분석하여 요청 메서드, 경로, 데이터 등을 추출하는 함수
}

module.exports = { handleRequest };
