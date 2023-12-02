const express = require('express');
const uploadController = require('../controller/uploadController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 이미지를 저장할 경로와 파일명을 설정합니다.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const category = req.query.category ? req.query.category + '/' : '';
        const destinationPath = path.join(__dirname, `../uploads/${category}`);
        cb(null, destinationPath); // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // 파일명
    }
})

const upload = multer({ storage: storage })

router.post('/', upload.single('file'), uploadController.fileUpload);

module.exports = router;