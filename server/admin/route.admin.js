const express = require('express');
const router = express.Router();
const admin = require('./controller.admin/admin')
const path = require('path');
const { body } = require('express-validator');
const validate = require('../middleware/validate')


router.post('/checkPassword',
    validate([
    body('password').notEmpty(),
    ]),
    admin.loginAdmin
);

module.exports = router