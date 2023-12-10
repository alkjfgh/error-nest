const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    documents:{
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

/** schemaname schema */
module.exports = mongoose.model('category', categorySchema);