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
    status: {
        type: String,
        default: function() {
            if(this.remainDate === 100000) return '영구정지';
            else if(this.remainDate === 200000) return '탈퇴';
            return '정지';
        }
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
        status: this.status,
        remainDate: this.remainDate,
        createdAt: this.createdAt,
        expireAt: this.expireAt,
    });

    banHistory.save()
        .then(() => next())
        .catch(err => next(err));
});

module.exports = mongoose.model('Ban', banSchema);