const mongoose = require('mongoose');

// Connect to MongoDB

const connectDB = async (url) => {
    try{
        await mongoose.connect(url);
        console.log("Mongo Database connected");
    }
    catch(error){
        console.log(error);
    }
};

module.exports = connectDB;