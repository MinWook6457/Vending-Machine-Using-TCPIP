const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

/**
 * mainDTO 함수: 서버로 보낼 데이터를 포맷팅하는 함수
 * @param {string} command - 실행할 명령어
 * @param {object} data - 전송할 데이터
 * @returns {object} - 포맷팅된 데이터 객체
 */
const mainDTO = async (command, data) => {
  // UUID를 생성하여 고유 해시를 만듦
  const hash = uuidv4();
  // 클라이언트 데이터를 포함하는 객체를 생성
  const clientData = {
    hash: hash,
    command: command,
    vendingId: "",
    clientData: data
  };
  return clientData;
};

// Electron의 메인 프로세스와의 통신을 위한 ipcRenderer를 공개
contextBridge.exposeInMainWorld('ipcRenderer', {
  /**
   * on 함수: 주어진 채널에 대해 이벤트 리스너를 설정
   * @param {string} channel - 채널 이름
   * @param {function} func - 이벤트 리스너 함수
   */
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  
  /**
   * invoke 함수: 주어진 채널로 비동기 메시지를 보내고 응답을 기다림
   * @param {string} channel - 채널 이름
   * @param {...*} args - 전송할 인자들
   * @returns {Promise} - 응답 데이터
   */
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  
  /**
   * removeAllListeners 함수: 주어진 채널의 모든 이벤트 리스너를 제거
   * @param {string} channel - 채널 이름
   */
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  /**
   * send 함수: 주어진 채널로 메시지를 전송
   * @param {string} channel - 채널 이름
   * @param {...*} args - 전송할 인자들
   */
  send : (channel, ...args) => {
    ipcRenderer.send(channel, ...args);  
  }
});

// 'buy' 네임스페이스를 메인 월드에 공개
contextBridge.exposeInMainWorld('buy', {
  /**
   * getBuy 함수: 음료를 구매하기 위해 서버에 요청을 보냄
   * @param {object} payload - 구매 정보
   * @returns {Promise} - 응답 데이터
   */
  getBuy: async (payload) => {
    const { beverage, stock, price, inputCoin } = payload;
    console.log(beverage, stock, price, inputCoin);

    // DTO를 생성하여 서버로 보낼 데이터 포맷팅
    const dtoResult = await mainDTO('buy', { beverage, stock, price, inputCoin });
    console.log('buy DTO:', dtoResult.clientData);
    
    // ipcRenderer를 통해 'getBuy' 채널로 요청을 보내고 응답을 기다림
    return ipcRenderer.invoke('getBuy', dtoResult.clientData);
  }
});
