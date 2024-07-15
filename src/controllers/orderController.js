const {transporter} = require("../../emailService");
const eventEmitter = require("../../eventEmitter");
const Order = require("../models/sql/order");
const OrderItem = require("../models/sql/orderItem");
const dotenv = require('dotenv');
dotenv.config();

exports.getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { customerId: req.params.customerId }
        });

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this customer.' });
        }

        // Use Promise.all to resolve all promises concurrently
        const orderItemsPromises = orders.map(async (order) => {
            const items = await OrderItem.findAll({
                where: { orderId: order.id }
            });
            return {
                order,
                items
            };
        });

        const orderItems = await Promise.all(orderItemsPromises);

        res.status(200).json(orderItems);
    } catch (err) {
        res.status(500).json({ message: "Error in getOrdersByCustomer", error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    const {customerId,items} = req.body;
    try{
        const order = await Order.create({customerId,totalAmount:0});

        let totalAmount = 0
        let bookItems = ``;
        const OrderItems = items.map((async item => {
            const orderItem = await OrderItem.create({
                orderId: order.id,
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.price
            });
            bookItems += `bookId:${item.bookId} | quantity:${item.quantity} | price:${item.price} \n`;
            totalAmount += orderItem.price * orderItem.quantity;
            return orderItem;
        }))

        await Promise.all(OrderItems);
        await order.update({totalAmount});

        // sending email notification for order items
        const sendOrderEmail = async () => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: req.user.email,
                subject: 'Order Confirmation',
                text: `Order Details: \nOrderId: ${order.id} \nTotal Amount: ${totalAmount} \nOrder Status: Confirmed.\nWe will deliver your order soon.`
            }

            const info = await transporter.sendMail(mailOptions);
            console.log("Email Sent: " + info.messageId);
            eventEmitter.emit('OrderConfirmedEmailSent',order);
        }
        sendOrderEmail().catch(error =>console.log(error.message));
        eventEmitter.emit('orderPlaced',order);
        res.status(201).json(order);
    }
    catch(err){
        res.status(400).json({message:"Error in createOrder",error:err.message});
    }
}
