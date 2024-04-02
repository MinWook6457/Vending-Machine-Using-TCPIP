const admin = require('./controller.admin/admin');

function parseRequest(requestData) {
       // HTTP 요청 데이터를 공백을 기준으로 분할하여 요소로 만듭니다.
       const parts = requestData.split(' ');

       // 분할된 요청 데이터로부터 요청 메서드, 경로, 데이터 등을 추출합니다.
       const method = parts[0].trim(); // 요청 메서드
       const path = parts[1].trim(); // 요청 경로
   
       // 요청 데이터를 구분하여 데이터를 추출합니다.
       let data = {};
       const requestBodyIndex = requestData.indexOf('\r\n\r\n');
       if (requestBodyIndex !== -1) {
           const requestBody = requestData.substring(requestBodyIndex + 4).trim();
           // 요청 바디가 존재하는 경우 데이터를 추출합니다.
           if (requestBody) {
               // 쉼표(,)로 구분된 키-값 쌍으로 데이터를 추출합니다.
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

function handleAdminRequest(requestData, socket) {
    const request = parseRequest(requestData);
    const { method, path } = request;

    // 요청 메서드와 경로에 따라 처리
    if (method === 'POST' && path === '/admin/checkPassword') {
        // POST /admin/checkPassword 요청 처리
        const { password } = request.data;
        admin.loginAdmin({ body: { password } }, { socket });
    } else {
        // 잘못된 요청 처리
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.write('404 Not Found');
    }
}

module.exports = { handleAdminRequest };
