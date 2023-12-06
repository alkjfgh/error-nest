const mongoose = require('mongoose'); // Get mongoose

const { Schema } = mongoose; // Get Schema

/** define test3 */

// 스키마 정의
const test3Schema = new Schema({
    // It is sample code
    id: {
        type: String,
        required: true,
        unique: true,
    },
    pw: {
        type: String,
        required: true,
    }
});

/** test3 schema */
// 모델생성
module.exports = mongoose.model('test3', test3Schema);