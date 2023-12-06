const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define test2 */
const test2Schema = new Schema({
    // It is sample code
    id: {
        type: String,
        required: true,
        unique: true,
    },
    pw: {
        type: String,
        required: true,
    }
});

/** test2 schema */
module.exports = mongoose.model('test2', test2Schema);