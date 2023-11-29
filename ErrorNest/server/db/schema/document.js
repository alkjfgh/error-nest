const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define document */
const documentSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

/** document schema */
module.exports = mongoose.model('document', documentSchema);