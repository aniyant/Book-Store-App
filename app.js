const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/mongodb');
const authRouter = require('./src/routes/authRoutes');
const bookRouter = require('./src/routes/bookRoutes');
const orderRouter = require('./src/routes/orderRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');
const sequelize = require('./src/config/mysqldb');
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('./src/config/swagger');
const logger = require('./src/config/logger');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { Server } = require('socket.io');
const eventEmitter = require('./eventEmitter');
const cronSchedulerToSendPromotionalEmails = require('./cronJobs');
const requestLogger = require('./src/middlewares/loggerMiddleware');


dotenv.config();
port = process.env.PORT || 3000;


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
}))

app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(openapiSpecification));
app.get('/', (req, res) => {
    res.status(200).send('This is home of the book store');
})

app.use('/auth',authRouter);
app.use('/books',bookRouter);
app.use('/orders',orderRouter);
app.use('/reviews',reviewRouter);
app.use((err,req,res,next)=>{
    logger.error(err.message);
    res.status(500).json({error:err.message});
})

//socket connection
io.on('connection',socket => {
    console.log(`New socket connection: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
 });
// Event newBook 
eventEmitter.on('newBook', (book) => {
    console.log('newBook event fired');
    io.emit('newBook', book);
});

eventEmitter.on('orderPlaced', (order) => {
    console.log('orderPlaced event fired');
    io.emit('orderPlaced', order);
});
// emit order status changed event
eventEmitter.on('orderStatusChanged',(order) => {
    io.emit('orderStatusChanged', order);
});

eventEmitter.on('OrderConfirmedEmailSent', (order)=>{
    io.emit('OrderConfirmedEmailSent', order);
});


 // cronScheduler to send promotional emails.
 cronSchedulerToSendPromotionalEmails();


//app listen

server.listen(port, () => {
    connectDB(process.env.MONGO_URI);
    sequelize.sync().then(()=>{
        console.log('Sql database connected and Synced');
    })
    // logger.info("Sql & MongoDB connection established");
    logger.log({
        level: 'info',
        message: "Sql & MongoDB connection established"
      });
    logger.info("Server is running on port ="+port);
    console.log(`Server is running on port ${port}`);
})

module.exports = app;