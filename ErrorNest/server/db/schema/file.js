const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = new Schema({
    fileName: { // 파일의 원본 이름
        type: String,
        required: true,
    },
    filePath: { // 파일의 저장 경로
        type: String,
        required: true
    },
    fileDes: { // 파일의 크기
        type: String,
        required: true
    },
    category:{ // 분류
        type: String,
        required: true
    },
    uploadAt: { // 파일의 업로드 날짜
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('file', fileSchema);