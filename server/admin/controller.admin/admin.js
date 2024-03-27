const response = require('../../../../response');

const loginAdmin = async (req, res) => {
    const adminPassword  = req.body;
    try {
        if(adminPassword === process.env.ADMIN_PASSWORD){
            res.render('../../views/adminPage.html')
            return response(res, 200, 'Success Admin Login');
        }

    } catch (err) {
        console.error(err);
        return response(res, 500, 'Failed to Admin Login');
    }
};

module.exports = {
    loginAdmin
};