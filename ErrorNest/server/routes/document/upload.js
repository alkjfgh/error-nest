const express = require('express');
const uploadController = require('../../controller/document/uploadController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 이미지를 저장할 경로와 파일명을 설정합니다.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('multer.diskStorage')
        const category = req.query.category ? req.query.category + '/' : '';
        console.log(category)
        const destinationPath = path.join(__dirname, `../../uploads/${category}`);
        console.log(destinationPath)
        // 폴더가 없으면 생성
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }
        cb(null, destinationPath); // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        console.log(file.originalname)
        cb(null, file.originalname) // 파일명
    }
})

//한글 깨짐

const upload = multer({ storage: storage })

router.post('/', upload.single('file'), uploadController.fileUpload);

module.exports = router;