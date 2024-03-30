const express = require('express');
const router = express.Router();
const vendingMachine = require('./controller.machine/vendingMachine')
const path = require('path');
const { body } = require('express-validator');
const validate = require('../middleware/validate')


router.post('/selectedBeverage',
    validate([
        body('description').isString(),
        body('price').isNumeric()
    ]),
    vendingMachine.selectedBeverage
);

router.post('/initialize',
    vendingMachine.initialize
)

module.exports = router