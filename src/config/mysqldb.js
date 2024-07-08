const { Sequelize } = require('sequelize');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.SQL_DB);

const sequelize = new Sequelize(process.env.SQL_DB, process.env.SQL_USER, process.env.SQL_PASSWORD, {
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  dialect: 'mysql',

  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;