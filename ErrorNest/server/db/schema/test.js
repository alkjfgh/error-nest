const mongoose = require('mongoose');

const { Schema } = mongoose;

const testSchema = new Schema({
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
    },
});

/** Test 스키마 */
module.exports = mongoose.model('Test', testSchema);