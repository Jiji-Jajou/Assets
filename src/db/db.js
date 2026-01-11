const mongoose = require("mongoose");
require("dotenv").config();



const MongoURL = process.env.MONGO_URL;

const connect = async() => {
    try {
        await mongoose.connect(MongoURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log({ message: 'Error when connecting to database', error });
    }
};

const disconnect = async() => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log({ message: 'Error when disconnect from database', error });
    }
};

module.exports = { connect, disconnect };