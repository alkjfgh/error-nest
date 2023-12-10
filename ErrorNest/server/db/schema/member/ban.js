const mongoose = require('mongoose'); // Get mongoose
const BanHistory = require('./banHistory'); // banHistory 모델 가져오기

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
    comment: {
        type: String
    },
    remainDate: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expireAt: {
        type: Date,
        default: function() {
            const date = new Date(this.createdAt);
            date.setDate(date.getDate() + this.remainDate);
            return date;
        },
        index: { expires: '0m' },
    },
});

banSchema.pre('save', function(next) {
    const banHistory = new BanHistory({
        target: this.target,
        type: this.type,
        comment: this.comment,
        remainDate: this.remainDate
    });

    banHistory.save()
        .then(() => next())
        .catch(err => next(err));
});

module.exports = mongoose.model('Ban', banSchema);