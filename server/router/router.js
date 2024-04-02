// router.js

const vendingMachineRouter = require('../machine/route.machine');
const adminRouter = require('../admin/route.admin');

// 클라이언트 요청 처리 함수
function handleClientRequest(requestData, socket) {
  if (requestData.startsWith('POST /machine/initialize')) {
    vendingMachineRouter.handleRequest(requestData, socket);
  } else if (requestData.startsWith('POST /admin/checkPassword')) {
    adminRouter.handleAdminRequest(requestData, socket);
  } else {
    // 잘못된 요청 처리
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.write('404 Not Found');
  }
}

module.exports = { handleClientRequest };
