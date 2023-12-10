const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

const banSchema = new Schema({
    target: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true
    },
    remainDate: {
        type: Date,
        required: true
    },
    histories: {
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

/** schemaname schema */
module.exports = mongoose.model('Ban', banSchema);