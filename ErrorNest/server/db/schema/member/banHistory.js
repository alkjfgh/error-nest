const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

const banHistorySchema = new Schema({
    target: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    comment: {
        type: String
    },
    remainDate: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('BanHistory', banHistorySchema);