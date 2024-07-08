const {DataTypes} = require('sequelize');
const sequelize = require('../../config/mysqldb');

const Customer = sequelize.define('Customers',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM(['admin', 'customer']),
        defaultValue: 'customer'
    }
});

module.exports = Customer;