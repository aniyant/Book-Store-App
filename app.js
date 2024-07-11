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


dotenv.config();
port = process.env.PORT || 3000;


const app = express();
app.use(express.json());
app.use(cors())
app.use(morgan('dev'));

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
//app listen

app.listen(port, () => {
    connectDB(process.env.MONGO_URI);
    sequelize.sync()
    .then(() => {
        logger.info('SQL Database connected and synced.');
    })
    .catch(err => {
        logger.error('Error syncing SQL database:', err.message);
        console.log("Error syncing SQL", err.message);
    });
    logger.info(`Server running on port ${port}`);
});

module.exports = app;