const {DataTypes} = require('sequelize');
const sequelize = require("../../config/mysqldb");
const Order = require('./order');

const OrderItem = sequelize.define('OrderItems',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

OrderItem.belongsTo(Order, {foreignKey: 'orderId'});

module.exports = OrderItem;