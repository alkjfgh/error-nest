const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define favorite */
const favoriteSchema = new Schema({
    target: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

/** favorite schema */
module.exports = mongoose.model('favorite', favoriteSchema);