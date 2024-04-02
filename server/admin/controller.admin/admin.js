const loginAdmin = async (socket) => {
    const adminPassword = 'your_admin_password'; // 관리자 비밀번호 설정
    const clientData = 'admin_password_data'; // 클라이언트에서 전송한 데이터

    try {
        if (clientData === adminPassword) { // 클라이언트 데이터와 관리자 비밀번호 비교
            console.log('관리자 페이지로 이동합니다.');
            socket.write('Success Admin Login'); // 성공 메시지를 클라이언트에 보냄
        } else {
            console.log('비밀번호가 일치하지 않습니다.');
            socket.write('Not matched password'); // 실패 메시지를 클라이언트에 보냄
        }
    } catch (err) {
        console.error('Failed to Admin Login:', err);
        socket.write('Failed to Admin Login'); // 오류 메시지를 클라이언트에 보냄
    }
};

module.exports = loginAdmin