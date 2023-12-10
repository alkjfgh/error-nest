const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define report */

/**
 * title: 문서 제목
 * version: 문서 버전
 * comment: 내용
 * createAt: 신고 등록일
 * writer: 신고 작성자
 */

const reportSchema = new Schema({
    // It is sample code
    title: {
        type: String,
        required: true,
    },
    version: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    writer: {
        type: String,
        required: true
    },
    status: { // 취소, 삭제, 대기
        type: String,
        default: "대기",
        required: true
    }
}, { versionKey: false, _id: true});

/** report schema */
module.exports = mongoose.model('report', reportSchema);