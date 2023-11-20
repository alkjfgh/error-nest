const mongoose= require('mongoose');
const dbUrl = require('./db_config.json')
const connect = () => {
    mongoose.connect(dbUrl.url)
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