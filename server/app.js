require('dotenv').config();
const net = require('net');
const {Vending, Coin, Record, Collect, Admin, sequelize} = require('./models/index');
const {Op} = require('sequelize');
const clients = [];

// 시퀄라이저 ORM 과 데이터 베이스 연동
sequelize
    .sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch(err => {
        console.error('데이터베이스 연결 실패:', err);
    });

// 서버 생성
const PORT1 = 3001;
const server1 = net.createServer(socket => {
    console.log('클라이언트가 연결되었습니다.');
    socket.setEncoding('utf8');

    // 클라이언트 소켓 최대 수 제한
    if (clients.length >= 2) {
        console.log('최대 클라이언트 수를 초과하여 연결을 거부합니다.');
        socket.destroy();
        return;
    }

    clients.push(socket);

    // sendVendingData(socket);

    socket.on('data', async data => {
        console.log('클라이언트로부터 받은 데이터:', data.toString());

        /* 여기부터 클라이언트 소켓으로 받은 if 절로 data stream 분기 */

        // 자판기 정보 불러오기
        if (data.startsWith('getInfo')) {
            try {
                sendVendingData(socket);
            } catch (err) {
                console.log('테스트 에러');
            }
        }

        // 화페 정보 불러오기
        if (data.startsWith('getCoin')) {
            try {
                sendCoinData(socket);
            } catch (err) {
                console.log('테스트 에러');
            }
        }

        // 음료 구매
        if (data.startsWith('buy')) {
            // 접두사 제거 및 payload 설정
            const payload = data.substring(3);
            try {
                const {beverage, price, inputCoin} = JSON.parse(payload);
                console.log(`구매 요청 - 음료수: ${beverage}, 가격 :${price}, 투입된 화폐 : ${inputCoin}`);

                // 구매 기록 저장
                Record.create({
                    beverage: beverage,
                    price: price,
                });

                // 구매하려는 음료가 존재하는지 파악
                const item = await Vending.findOne({
                    where: {beverage},
                    attributes: ['beverage', 'price', 'stock', 'money'],
                });

                console.log(item.money);

                // 구매 하려는 음료가 존재한 경우
                if (item) {
                    if (item.stock > 0) {
                        // 재고가 있는 경우
                        const newStock = item.stock - 1; // 해당 음료 재고 감소

                        // 감소된 재고로 업데이트 및 해당 음료 매출 증가
                        await Vending.update({stock: newStock, money: (item.money += price)}, {where: {beverage}});
                        const remainingCoin = inputCoin - price;
                        // 구매 완료 후 음료 이름, 남은 재고, 가격, 남은 입력된 화폐 전달
                        socket.write(
                            JSON.stringify({
                                success: true,
                                message: '구매 완료',
                                beverage,
                                remainingStock: newStock,
                                price,
                                remainingCoin,
                            }),
                        );
                    } else {
                        socket.write(JSON.stringify({success: false, message: '재고 부족'}));
                    }
                } else {
                    socket.write(JSON.stringify({success: false, message: '음료를 찾을 수 없음'}));
                }
            } catch (error) {
                console.error('구매 데이터 처리 에러:', error);
                socket.write(JSON.stringify({success: false, message: '구매 실패'}));
            }
        }

        // 화폐 투입
        if (data.startsWith('input')) {
            // 접두사 제거 및 payload 설정
            const payload = data.substring(5);
            try {
                const {value, name} = JSON.parse(payload);
                console.log(`코인 입력 요청 - 코인 값: ${value}, 코인 이름: ${name}`);

                // 입력된 화폐로부터 데이터베이스에서 검색
                const coin = await Coin.findOne({
                    where: {price: value},
                    attributes: ['unit', 'price', 'change'],
                });

                // 존재하는 화폐인 경우
                if (coin) {
                    // 화폐 갯수 증가
                    const newChange = coin.change + 1;
                    await Coin.update({change: newChange}, {where: {price: value}});
                    socket.write(
                        JSON.stringify({success: true, message: '코인 입력 완료', name, remainingChange: newChange}),
                    );
                } else {
                    socket.write(JSON.stringify({success: false, message: '코인을 찾을 수 없음'}));
                }
            } catch (error) {
                console.error('코인 데이터 처리 에러:', error);
                socket.write(JSON.stringify({success: false, message: '코인 입력 실패'}));
            }
        }

        // 화폐 반환
        if (data.startsWith('change')) {
            const payload = data.substring(6);
            try {
                const {inputCoin} = JSON.parse(payload);

                console.log(`잔돈 반환 요청 - 투입된 금액 : ${inputCoin}`);

                // 입력된 금액을 바탕으로 잔돈 계산
                const calChange = await calculateChange(inputCoin);

                // 계산된 잔돈을 데이터베이스에 업데이트하고 클라이언트에 반환
                const change = await updateCoinChange(calChange, socket);

                // 잔돈 반환 완료 메시지와 함께 계산된 잔돈을 클라이언트에 전송
                socket.write(JSON.stringify({success: true, message: '잔돈 반환 완료', change}));
            } catch (error) {
                // 에러 발생 시 잔돈 반환 실패 메시지를 클라이언트에 전송
                socket.write(JSON.stringify({success: false, message: '잔돈 반환 실패'}));
            }
        }

        // 비밀번호 검증
        if (data.startsWith('password')) {
            const payload = data.substring(8);
            try {
                // JSON 문자열로부터 입력된 비밀번호 추출
                const {password} = JSON.parse(payload);

                console.log('입력된 비밀번호', password);

                // 입력된 비밀번호와 일치하는 관리자 정보 조회
                const admin = await Admin.findOne({
                    where: {
                        password: password,
                    },
                    attributes: ['password'],
                });

                console.log('조회된 관리자 정보:', admin);

                // 관리자 정보가 없으면 비밀번호가 틀렸다는 메시지를 클라이언트에 전송
                if (!admin) {
                    socket.write(JSON.stringify({success: false, message: '비밀번호가 맞지 않습니다.', password}));
                } else {
                    // 비밀번호가 일치하는 경우 성공 메시지를 클라이언트에 전송
                    if (password === admin.password) {
                        socket.write(JSON.stringify({success: true, message: '비밀번호가 맞습니다.', password}));
                    } else {
                        // 비밀번호가 일치하지 않는 경우 실패 메시지를 클라이언트에 전송
                        socket.write(JSON.stringify({success: false, message: '비밀번호가 맞지 않습니다.'}));
                    }
                }
            } catch (error) {
                // 에러 발생 시 관리자 모드 에러 메시지를 클라이언트에 전송
                console.error('비밀번호 검증 에러:', error);
                socket.write(JSON.stringify({success: false, message: '관리자 모드 에러', error: error.message}));
            }
        }

        // 관리자 비밀번호 변경
        if (data.startsWith('adminPassword')) {
            const payload = data.substring(13);
            try {
                // JSON 문자열로부터 현재 비밀번호와 새로운 비밀번호 추출
                const {currentPassword, changePassword} = JSON.parse(payload);
                console.log(`이전 비밀번호: ${currentPassword}, 새로운 비밀번호: ${changePassword}`);

                // 현재 비밀번호를 가진 관리자 정보 조회
                const admin = await Admin.findOne({
                    where: {password: currentPassword},
                });

                // 관리자 정보가 없으면 현재 비밀번호가 틀렸다는 메시지를 클라이언트에 전송하고 함수 종료
                if (!admin) {
                    socket.write(JSON.stringify({success: false, message: '현재 비밀번호가 일치하지 않습니다.'}));
                    return;
                }

                // 새로운 비밀번호로 비밀번호 변경 후 성공 메시지를 클라이언트에 전송
                await admin.update({password: changePassword});
                socket.write(JSON.stringify({success: true, message: '비밀번호가 성공적으로 변경되었습니다.'}));
            } catch (error) {
                // 에러 발생 시 오류 메시지를 클라이언트에 전송
                console.error('비밀번호 변경 중 오류가 발생했습니다:', error);
                socket.write(JSON.stringify({success: false, message: '비밀번호 변경 중 오류가 발생했습니다.'}));
            }
        }

        // 자판기 재고 보충
        if (data.startsWith('refresh')) {
            try {
                // 데이터베이스에서 자판기 정보 조회
                const vendingData = await Vending.findAll({
                    attributes: ['beverage', 'price', 'stock'],
                });

                // 조회된 자판기 정보를 JSON 문자열로 변환
                const refreshData = JSON.stringify(vendingData);

                // JSON 문자열을 다시 객체로 파싱
                const test = JSON.parse(refreshData);

                // 자판기 재고 보충 실행
                await refreshVending(test);

                // 재고 보충 후 업데이트된 데이터를 가져와 클라이언트에 전송
                const data = await refreshVendingInfo(test);

                // 클라이언트에 재고 보충 완료 메시지와 업데이트된 데이터 전송
                socket.write(JSON.stringify({success: true, message: '재고 보충 완료', data}));
            } catch (err) {
                // 에러 발생 시 실패 메시지를 클라이언트에 전송
                socket.write(JSON.stringify({success: false, message: '재고 보충 실패'}));
            }
        }
        // 전체 자판기 데이터 전송
        if (data.startsWith('makeUpVending')) {
            try {
                // 데이터베이스에서 모든 자판기 데이터 조회
                const vendingData = await Vending.findAll({
                    attributes: ['beverage', 'price', 'stock', 'money'],
                });

                // 조회된 자판기 데이터를 JSON 문자열로 변환
                const refreshData = JSON.stringify(vendingData);

                // 클라이언트에 전송
                socket.write(JSON.stringify({success: true, message: '전체 자판기 데이터 전달', refreshData}));
            } catch (err) {
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success: false, message: '자판기 통계 에러'}));
            }
        }

        // 전체 화폐 데이터 전송
        if (data.startsWith('makeUpCoin')) {
            try {
                // 데이터베이스에서 모든 화폐 데이터 조회
                const coinData = await Coin.findAll({
                    attributes: ['unit', 'price', 'change'],
                });

                // 조회된 화폐 데이터를 JSON 문자열로 변환
                const refreshData = JSON.stringify(coinData);

                // 클라이언트에 전송
                socket.write(JSON.stringify({success: true, message: '전체 화폐 데이터 전달', refreshData}));
            } catch (err) {
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success: false, message: '화폐 데이터 전달 중 에러'}));
            }
        }

        // 기록 데이터 전송
        if (data.startsWith('record')) {
            const date = data.substring(6).trim(); // 날짜 문자열 추출 및 공백 제거
            try {
                // 데이터베이스에서 자판기 데이터 조회
                const vendingData = await Vending.findAll({
                    attributes: ['beverage'],
                });

                const parseData = JSON.parse(JSON.stringify(vendingData));

                const records = {};

                const startDate = new Date(`${date}T00:00:00`);
                const endDate = new Date(`${date}T23:59:59`);

                for (const item of parseData) {
                    const beverage = item.beverage;
                    // 기록 수 계산
                    const recordCount = await Record.count({
                        where: {
                            beverage: beverage,
                            createdAt: {
                                [Op.between]: [startDate, endDate],
                            },
                        },
                    });
                    records[beverage] = recordCount;
                }

                console.log(records);
                // 클라이언트에 전송
                socket.write(JSON.stringify({success: true, message: '기록 데이터 전달', records}));
            } catch (err) {
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success  : false, message: '기록 데이터 전달 중 에러'}));
            }
        }

        // 총 합계 전송
        if (data.startsWith('collect')) {
            try {
                // 데이터베이스에서 화폐 데이터 조회
                const coinData = await Coin.findAll({
                    attributes: ['price', 'change'],
                });
                
                // 데이터 파싱
                const parseData = JSON.parse(JSON.stringify(coinData));

                let totalCollected = 0;

                // 파싱된 데이터 객체 반복
                for (const item of parseData) {
                    const change = item.change;
                    const price = item.price;

                    if (change > 2) {
                        const coinsToCollect = change - 2;
                        totalCollected += coinsToCollect * price;

                        // 데이터베이스 업데이트
                        await Coin.update({change: 2}, {where: {price: price}});
                    }
                }

                // 수집된 총 합계 데이터 생성
                Collect.create({price: totalCollected});

                console.log({success: true, message: '총 합계 전달', totalCollected});
                // 클라이언트에 전송
                socket.write(JSON.stringify({success: true, message: '총 합계 전달', totalCollected}));
            } catch (error) {
                console.error('Error collecting coins:', error);
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success: false, message: '코인 수집 중 에러'}));
            }
        }

        // 음료 이름 변경 요청 처리
        if (data.startsWith('beverage')) {
            const payload = data.substring(8);
            const {beverageName, newBeverageName} = JSON.parse(payload);
            try {
                // 데이터베이스에서 해당 음료의 이름을 새로운 이름으로 변경
                const result = await Vending.update({beverage: newBeverageName}, {where: {beverage: beverageName}});

                if (result[0] === 0) {
                    // 변경 실패 시 해당 음료를 찾을 수 없음 메시지 전송
                    socket.write(
                        JSON.stringify({success: false, message: '음료 이름 변경 실패: 해당 음료를 찾을 수 없습니다.'}),
                    );
                } else {
                    // 변경 성공 시 완료 메시지 전송
                    socket.write(JSON.stringify({success: true, message: '음료 이름 변경 완료'}));
                }
            } catch (error) {
                console.error(error);
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success: false, message: '음료 이름 변경 실패'}));
            }
        }

        // 음료 가격 변경 요청 처리
        if (data.startsWith('price')) {
            const payload = data.substring(5);
            const {beverageName, beveragePrice, newBeveragePrice} = JSON.parse(payload);
            try {
                // 데이터베이스에서 해당 음료의 가격을 새로운 가격으로 변경
                const result = await Vending.update(
                    {price: parseInt(newBeveragePrice)},
                    {
                        where: {
                            beverage: beverageName,
                        },
                    },
                );

                if (result[0] === 0) {
                    // 변경 실패 시 해당 음료를 찾을 수 없음 메시지 전송
                    socket.write(
                        JSON.stringify({success: false, message: '음료 가격 변경 실패: 해당 음료를 찾을 수 없습니다.'}),
                    );
                } else {
                    // 변경 성공 시 완료 메시지 전송
                    socket.write(JSON.stringify({success: true, message: '음료 가격 변경 완료'}));
                }
            } catch (error) {
                console.error(error);
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success: false, message: '음료 가격 변경 실패'}));
            }
        }

        // 잔돈 채우기 요청 처리
        if (data.startsWith('fill')) {
            try {
                // 데이터베이스에서 모든 화폐 데이터 조회
                const coins = await Coin.findAll({});

                coins.forEach(async coin => {
                    if (coin.change === 0) {
                        // 화폐가 부족한 경우 2로 채우기
                        await Coin.update({change: 2}, {where: {id: coin.id}});
                    }
                });

                // 성공 메시지 전송
                socket.write(JSON.stringify({success: true, message: '잔돈 채우기 성공'}));
            } catch (error) {
                // 에러 발생 시 실패 메시지 전송
                socket.write(JSON.stringify({success: true, message: '잔돈 채우기 중 오류 발생'}));
            }
        }
    });
    // 클라이언트 연결 종료 시 처리
    socket.on('close', () => {
        console.log('클라이언트 연결이 종료되었습니다.');
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });

    // 에러 발생 시 처리
    socket.on('error', err => {
        console.error('에러 발생:', err);
    });
});

// 서버 시작
server1.listen(PORT1, () => {
    console.log(`서버가 ${PORT1} 포트에서 대기 중입니다.`);
});

// 데이터베이스에 존재하는 모든 자판기 데이터 전송
function sendVendingData(socket) {
    Vending.findAll({
        attributes: ['beverage', 'price', 'stock'],
    })
        .then(data => {
            const vendingData = JSON.stringify(data);
            // 클라이언트에 전달
            socket.write(vendingData);
        })
        .catch(error => {
            console.log('데이터베이스 쿼리 에러:', error);
        });
}

// 데이터베이스에 존재하는 모든 화폐 데이터 전송
function sendCoinData(socket) {
    Coin.findAll({
        attributes: ['unit', 'price', 'change'],
    })
        .then(data => {
            const coinData = JSON.stringify(data);
            // 클라이언트에 전달
            socket.write(coinData);
        })
        .catch(error => {
            console.log('데이터베이스 쿼리 에러:', error);
        });
}

// 잔돈 계산
async function calculateChange(inputCoin) {
    const tempCoins = [1000, 500, 100, 50, 10];
    let remainChange = inputCoin;

    const changes = {};

    for (const coinValue of tempCoins) {
        const count = Math.floor(remainChange / coinValue);
        if (count > 0) {
            changes[coinValue] = count;
            remainChange -= coinValue * count;
        } else {
            changes[coinValue] = 0;
        }
    }

    console.log(changes);

    return changes;
}

async function updateCoinChange(change, socket) {
    for (const [unit, count] of Object.entries(change)) {
        try {
            const coin = await Coin.findOne({where: {price: parseInt(unit)}, attributes: ['price', 'change']});

            if (!coin) {
                console.log(`${unit} 코인이 존재하지 않습니다.`);
                socket.write(JSON.stringify({success: false, message: '코인을 찾을 수 없음'}));
                return;
            }

            console.log(`${coin.price}의 남은 화폐 : ${coin.change}`);

            if (coin.change < count) {
                console.log('화폐 부족');
                socket.write(JSON.stringify({success: false, message: '잔돈 반환 실패, 화폐가 부족합니다.'}));

                return;
            }

            const newChange = coin.change - count;
            await Coin.update({change: newChange}, {where: {price: parseInt(unit)}});
            console.log(`${unit} 코인 업데이트 성공`);
        } catch (error) {
            console.error(`${unit} 코인 업데이트 실패:`, error);
        }
    }

    return change;
}

async function refreshVending(refreshData) {
    for (const [number, data] of Object.entries(refreshData)) {
        try {
            await Vending.update({stock: 10}, {where: {beverage: data.beverage}});
            // console.log(`${beverage} 재고 보충 성공`);
        } catch (error) {
            console.error(`${beverage} 재고 보충 실패:`, error);
        }
    }
}

async function refreshVendingInfo(refreshData) {
    for (const [number, data] of Object.entries(refreshData)) {
        data.stock = 10;
    }

    return refreshData;
}
