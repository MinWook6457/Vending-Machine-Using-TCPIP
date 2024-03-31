const response = require('../../response')
require('dotenv').config();

const loginAdmin = async (req, res) => {
    const adminPassword  = req.body;

    // console.log('관리자 비밀번호 입력 : ' + adminPassword.password)
    // console.log('닷엔브 비밀번호 : '+ process.env.ADMIN_PASSWORD)
    try {

        if(adminPassword.password === process.env.ADMIN_PASSWORD) { // 관리자 비밀번호 확인
            
            console.log('관리자 페이지로 이동합니다.')
            // 관리자 페이지로 이동
            return response(res,200,'Success Admin Login')
        } else {
            console.log('비밀번호가 일치하지 않습니다.')
            return response(res,401,'Not matched password')
        }

    } catch (err) {
        console.error(err);
        return response(res, 500, 'Failed to Admin Login');
    }
};

module.exports = {
    loginAdmin
};