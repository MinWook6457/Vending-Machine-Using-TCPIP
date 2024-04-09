const adminController = require('./controller.admin/admin');

function parseRequest(requestData) {
       // HTTP 요청 데이터를 공백을 기준으로 분할
       const parts = requestData.split(' ');

       // 분할된 요청 데이터
       const method = parts[0].trim(); // 요청 메서드
       const path = parts[1].trim(); // 요청 경로
   
       // 요청 데이터를 구분하여 데이터를 추출
       let data = {};
       const requestBodyIndex = requestData.indexOf('\r\n\r\n');
       if (requestBodyIndex !== -1) {
           const requestBody = requestData.substring(requestBodyIndex + 4).trim();
           // 요청 바디가 존재하는 경우 데이터를 추출
           if (requestBody) {
               // 쉼표(,)로 구분된 키-값 쌍으로 데이터를 추출 ex) body값
               const keyValuePairs = requestBody.split('&');
               keyValuePairs.forEach(keyValuePair => {
                   const [key, value] = keyValuePair.split('=');
                   data[key] = decodeURIComponent(value);
               });
           }
       }
   
       return {
           method,
           path,
           data
       };
}
// 클라이언트 요청 처리 함수
function handleAdminRequest(requestData, socket) {
    const [method, path] = parseRequest(requestData);
    // 요청 메서드와 경로에 따라 적절한 처리 함수 호출
    if (method === 'POST' && path === '/admin/checkPassword') {
        // POST /admin/checkPassword 요청 처리
        adminController.loginAdmin(socket);
    } else {
        // 잘못된 요청 처리
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.write('404 Not Found');
        socket.end();
    }
}

module.exports = { handleAdminRequest };
