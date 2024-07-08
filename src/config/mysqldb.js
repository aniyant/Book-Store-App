const { Sequelize } = require('sequelize');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.SQL_DB, process.env.SQL_USER, process.env.SQL_PASSWORD, {
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  dialect: 'mysql',
});

module.exports = sequelize;