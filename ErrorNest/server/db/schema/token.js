const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define token */
const tokenSchema = new Schema({
    // It is sample code
    id: {
        type: String,
    },
    token: {
        type: String
    }
});

/** token schema */
module.exports = mongoose.model('token', tokenSchema);