const { ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

// 비동기 함수를 사용하여 메시지를 메인 프로세스로 보내고 응답을 받음
async function sendMessageToMainProcess(type, payload) {
    const processId = uuidv4(); // UUID 생성
    const message = { processId, type, payload }; // 메시지 생성

    try {
        const response = await ipcRenderer.invoke('message', message); // 메시지 전송 및 응답 대기
        return response;
    } catch (error) {
        console.error('Error sending message to main process:', error);
        return null;
    }
}

// 메시지 타입에 따라 처리하는 함수
async function handleMessage(type, payload) {
    switch (type) {
        case 'stock':
            // 재고 처리 로직
            console.log('Handling stock message with payload:', payload);
            break;
        case 'select':
            // 선택 처리 로직
            console.log('Handling select message with payload:', payload);
            break;
        case 'adminPassword':
            // 관리자 비밀번호 처리 로직
            console.log('Handling adminPassword message with payload:', payload);
            break;
        default:
            console.error('Unknown message type:', type);
    }
}

// 메인 프로세스에서 보낸 메시지 수신 및 처리
ipcRenderer.on('message', async (event, message) => {
    const { type, payload } = message;
    await handleMessage(type, payload);
});

// preload script에서 노출되는 객체
const vendingBridge = {
    processMessage: async (type, payload) => {
        return await sendMessageToMainProcess(type, payload);
    }
};

// 노출 객체를 렌더러 프로세스에 노출
window.vendingBridge = vendingBridge;
