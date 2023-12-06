const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define member */
const memberSchema = new Schema({
    // It is sample code
    id: {
        type: String,
        required: true,
        unique: true,
    },
    pw: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

/** member schema */
module.exports = mongoose.model('member', memberSchema);