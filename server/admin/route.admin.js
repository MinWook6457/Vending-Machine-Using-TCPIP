const express = require('express');
const router = express.Router();
const admin = require('./controller.admin/admin')
const path = require('path');
const { body } = require('express-validator');
const validate = require('../../../middleware/validate');


router.post('/admin',
    validate([
    body('password').isString(),
    ]),
    admin.loginAdmin
);

module.exports = router