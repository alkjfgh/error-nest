const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define member */
const memberSchema = new Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        get: (date) => date.toISOString().split('T')[0]
    },
    level: {
        type: String,
        default: "user",
    },
    hashtag: {
        type: Number,
        required: true,
        default: 0,
    }
});

memberSchema.pre('save', async function(next) {
    if (this.isNew) {
        const latestDoc = await this.constructor.findOne({ name: this.name }).sort('-hashtag');
        if (latestDoc) {
            this.hashtag = latestDoc.hashtag + 1;
        } else {
            this.hashtag = 1;
        }
    }

    next();
});

/** member schema */
module.exports = mongoose.model('member', memberSchema);