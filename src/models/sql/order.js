const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysqldb");
const Customer = require("./customer");

const Order = sequelize.define('Orders', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'id'
        }
    },
    totalAmount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    }
});
 
Order.belongsTo(Customer,{ foreignKey: 'customerId'});

module.exports = Order;