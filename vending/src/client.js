const net = require('node:net');

/* 소켓 IP 및 포트 번호 설정 */
const SERVER_IP = 'localhost';
const SERVER_PORT1 = 3001;

/* 자판기 및 코인 정보 변수 초기화 */
let vendingInfo = null;
let coinInfo = null;

console.log('클라이언트 실행');

// 클라이언트 소켓 연결
const socket = net.createConnection({
    host: SERVER_IP,
    port: SERVER_PORT1
}, () => {
    console.log('서버에 연결되었습니다.');
});

// 서버 소켓으로 부터 받을 데이터 바인딩
socket.on('data', (data) => {
    console.log('received data from server:', data.toString());
    const dataString = data.toString();

    const [vendingDataString, coinDataString] = dataString.split('|');  // 구분자를 사용하여 분리

    try {
        if (vendingDataString) {
            vendingInfo = JSON.parse(vendingDataString);
            console.log('Info:', vendingInfo);
        } else {
            console.warn('Info data is undefined');
        }
    } catch (error) {
        console.error('JSON 파싱 에러:', error);
    }
});

// 소켓 닫기
socket.on('close', () => {
    console.log('서버와의 연결이 종료되었습니다.');
});

// 소켓 에러 처리
socket.on('error', (err) => {
    console.error('에러 발생:', err);
});

// 소켓 연결 시 데이터 보내기
socket.on('connect', () => {
    console.log('connect test');
    socket.write('data');
});

// 자판기 정보를 불러오는 함수
function getInfo() {
    // Promise 초기화 => 비동기 작업 처리
    return new Promise((resolve, reject) => {
        // getInfo 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`getInfo`); // payload => getInfo
        // once : 서버가 데이터를 보낼 때 한 번 트리거되는 이벤트 리스너를 설정
        socket.once('data', (data) => {
            try {
                // 파싱이 성공하면, 파싱된 응답으로 Promise를 해결
                const response = JSON.parse(data);
                // 파싱이 실패하면, 오류를 캐치하여 에러 메시지와 함께 Promise를 거부
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 음료를 구매하는 함수
function buyDrink(beverage, stock, price, inputCoin) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ beverage, stock, price, inputCoin });
        console.log(payload);
        console.log('서버에 구매 데이터 전달');
        // buy 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`buy${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 음료 가격을 변경하는 함수
function beveragePriceChange(beverageName, beveragePrice, newBeveragePrice) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ beverageName, beveragePrice, newBeveragePrice });
        console.log(`선택된 음료 가격` + payload);
        // price 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`price${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 음료 이름을 변경하는 함수
function beverageNameChange(beverageName, newBeverageName) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ beverageName, newBeverageName });
        console.log(`선택된 음료 이름` + payload);
        // beverage 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`beverage${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 화폐 정보를 입력하는 함수
function inputCoin(value, name) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ value, name });
        console.log(`선택된 화폐 정보` + payload);
        // input 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`input${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 코인 정보를 가져오는 함수
function getCoinInfo() {
    return coinInfo;
}

// 잔돈을 계산하는 함수
function getChange(inputCoin) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ inputCoin });
        console.log(`잔돈 금액` + payload);
        // change 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`change${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 비밀번호를 확인하는 함수
function checkPassword(password) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ password });
        console.log(`입력된 비밀번호` + password);
        // password 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`password${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket1 error: ' + err.message));
        });
    });
}

// 관리자 비밀번호를 변경하는 함수
function changeAdminPassword(currentPassword, changePassword) {
    return new Promise((resolve, reject) => {
        // 페이로드 준비
        const payload = JSON.stringify({ currentPassword, changePassword });
        console.log(`입력된 비밀번호: ${changePassword}`);
        // adminPassword 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`adminPassword${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('Socket error: ' + err.message));
        });
    });
}

// 데이터를 서버로 새로고침하는 함수
function refresh() {
    return new Promise((resolve, reject) => {
        console.log('Refresh Data To Server');
        // refresh 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`refresh`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket error: ' + err.message));
        });
    });
}

// 코인을 채우는 함수
function filledCoin() {
    return new Promise((resolve, reject) => {
        console.log('Filled Coin Message To Server');
        // fill 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`fill`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket error: ' + err.message));
        });
    });
}

// 자판기를 보충하는 함수
function makeUpVending() {
    return new Promise((resolve, reject) => {
        console.log('Make Up Message To Server');
        // makeUpVending 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`makeUpVending`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket error: ' + err.message));
        });
    });
}

// 코인을 보충하는 함수
function makeUpCoin() {
    return new Promise((resolve, reject) => {
        console.log('Make Up Coin Message To Server');
        // makeUpCoin 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`makeUpCoin`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket error: ' + err.message));
        });
    });
}

// 기록을 서버로 전송하는 함수
function record(date) {
    return new Promise((resolve, reject) => {
        console.log('Record Message To Server' + date);
        const payload = date;
        // record 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`record${payload}`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket error: ' + err.message));
        });
    });
}

// 수익을 수집하는 함수
function collect() {
    return new Promise((resolve, reject) => {
        console.log('Collect Message To Server');
        // collect 문자열을 접두사로 하여 소켓 연결을 통해 서버로 전송
        socket.write(`collect`);

        // 서버 응답 처리
        socket.once('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                resolve(response);
            } catch (error) {
                reject(new Error('Failed to parse server response'));
            }
        });

        // 소켓 에러 처리
        socket.once('error', (err) => {
            reject(new Error('socket error: ' + err.message));
        });
    });
}

module.exports = {
    socket, getInfo, buyDrink, getCoinInfo, inputCoin, getChange, checkPassword, refresh,
    makeUpVending, makeUpCoin, record, collect, changeAdminPassword, filledCoin, beverageNameChange, beveragePriceChange
};
