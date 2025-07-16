const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define schemaname */
const schemanameSchema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

/** schemaname schema */
module.exports = mongoose.model('schemaname', schemanameSchema);