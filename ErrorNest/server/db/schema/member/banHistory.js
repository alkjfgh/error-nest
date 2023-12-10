const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

const banHistorySchema = new Schema({
    target: {
        type: String
    },
    type: {
        type: String
    },
    comment: {
        type: String
    },
    remainDate: {
        type: Number
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('BanHistory', banHistorySchema);