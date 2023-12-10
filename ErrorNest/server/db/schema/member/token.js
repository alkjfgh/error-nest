const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define token */
const tokenSchema = new Schema({
    // It is sample code
    id: {
        type: String,
    },
    token: {
        type: String,
    },
    date_time: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

// token db 일정시간 후에 삭제
tokenSchema.index({date_time: 1}, {expireAfterSeconds: 180});

/** token schema */
module.exports = mongoose.model('token', tokenSchema);