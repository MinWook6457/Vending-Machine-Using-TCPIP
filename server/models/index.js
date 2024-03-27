'use strict'

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Coin = require('./coin/coin')(sequelize, Sequelize) // 화폐 테이블
db.Vending = require('./vending/vending')(sequelize,Sequelize) // 자판기 테이블


db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db;