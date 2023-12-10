const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define document */
const documentSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    version: {
        type: Number,
        require: true,
        default: 0,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: Array
    },
    writer: {
        type: String,
        require: true
    },
    updateAt: {
        type: Date,
        default: Date.now,
    }
});

documentSchema.pre('save', async function(next) {
    if (this.isNew) {
        const latestDoc = await this.constructor.findOne({ title: this.title }).sort('-version');
        if (latestDoc) {
            this.version = latestDoc.version + 1;
        } else {
            this.version = 1;
        }
    }

    next();
});

/** document schema */
module.exports = mongoose.model('document', documentSchema);