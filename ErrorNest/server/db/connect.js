const mongoose= require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
    path : path.join(__dirname, './.env')
});
const {DB_URI} = process.env;

const connect = () => {
    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection successful');
    }).catch((error) => {
        console.log('MongoDB connection error', error);
    });
};

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('MongoDB connection was lost. Lets try connecting again.');
    connect();
});

module.exports = connect;