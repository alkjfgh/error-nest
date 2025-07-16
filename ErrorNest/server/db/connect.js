const mongoose= require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const logger = require("../log/logger");

/** 현재 폴더에 있는 .env 설멍 파일 가져오기 */
dotenv.config({
    path : path.join(__dirname, './.env')
});
const {URI, DB, OPTIONS} = process.env;

/** 몽고디비 연결 */
const connect = () => {
    mongoose.connect(URI + DB + OPTIONS, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('MongoDB connection successful');
    }).catch((error) => {
        logger.error('MongoDB connection error: ' +  error.message);
    });
};

mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error: ' +  error.message);
});
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection was lost. Lets try connecting again.');
    connect();
});

module.exports = connect;